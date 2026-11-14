
import platform
import subprocess
import re
import statistics
import json
import argparse
import socket
import time
from datetime import datetime
from pathlib import Path


# ==========================================
# 1. GENERAL COMMAND EXECUTION
# ==========================================

def run_command(command, timeout=30):
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=timeout,
            errors="replace"
        )
        return result.stdout

    except Exception:
        return ""


# ==========================================
# 2. FIND DEFAULT ROUTER / GATEWAY
# SUPPORTS IPv4 AND IPv6
# ==========================================

def get_default_gateway():
    output = run_command(["ipconfig"])

    matches = re.findall(
        r"Default Gateway[ .]*:\s*([^\s]+)",
        output,
        re.IGNORECASE
    )

    for gateway in matches:
        if gateway and gateway != "0.0.0.0":
            return gateway

    return None


# ==========================================
# 3. LATENCY, JITTER AND PACKET LOSS
# ==========================================

def test_network(host="1.1.1.1", count=10):
    command = ["ping", "-n", str(count), host]

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=30,
            errors="replace"
        )

        output = result.stdout

        times = re.findall(
            r"time[=<](\d+)ms",
            output,
            re.IGNORECASE
        )

        latencies = [int(value) for value in times]

        loss_match = re.search(
            r"(\d+)%\s*loss",
            output,
            re.IGNORECASE
        )

        if latencies:
            average = round(statistics.mean(latencies), 2)
            minimum = min(latencies)
            maximum = max(latencies)

            differences = [
                abs(latencies[i] - latencies[i - 1])
                for i in range(1, len(latencies))
            ]

            jitter = (
                round(statistics.mean(differences), 2)
                if differences else 0
            )

        else:
            average = None
            minimum = None
            maximum = None
            jitter = None

        packet_loss = (
            int(loss_match.group(1))
            if loss_match else None
        )

        return {
            "host": host,
            "average_latency_ms": average,
            "minimum_latency_ms": minimum,
            "maximum_latency_ms": maximum,
            "jitter_ms": jitter,
            "packet_loss_percent": packet_loss,
            "successful_pings": len(latencies),
            "total_pings": count,
            "status": "success" if latencies else "unreachable"
        }

    except Exception as error:
        return {
            "host": host,
            "status": "error",
            "network_test_error": str(error)
        }


# ==========================================
# 4. ROUTER / LOCAL NETWORK TEST
# ==========================================

def test_local_network():
    gateway = get_default_gateway()

    if not gateway:
        return {
            "gateway": None,
            "status": "unavailable",
            "message": "Default gateway could not be identified."
        }

    gateway_test = test_network(
        gateway,
        count=4
    )

    return {
        "gateway": gateway,
        "status": gateway_test.get("status"),
        "average_latency_ms": gateway_test.get(
            "average_latency_ms"
        ),
        "packet_loss_percent": gateway_test.get(
            "packet_loss_percent"
        ),
        "successful_pings": gateway_test.get(
            "successful_pings"
        ),
        "total_pings": gateway_test.get(
            "total_pings"
        )
    }


# ==========================================
# 5. DNS CONNECTIVITY TEST
# ==========================================

def test_dns():
    domain = "example.com"
    start_time = time.perf_counter()

    try:
        addresses = socket.getaddrinfo(
            domain,
            443,
            type=socket.SOCK_STREAM
        )

        response_time = round(
            (time.perf_counter() - start_time) * 1000,
            2
        )

        resolved_addresses = list(
            dict.fromkeys(
                item[4][0] for item in addresses
            )
        )

        return {
            "domain": domain,
            "status": "success",
            "resolution_time_ms": response_time,
            "resolved_addresses": resolved_addresses
        }

    except socket.gaierror as error:
        return {
            "domain": domain,
            "status": "failed",
            "resolution_time_ms": None,
            "error": str(error)
        }

    except Exception as error:
        return {
            "domain": domain,
            "status": "error",
            "error": str(error)
        }


# ==========================================
# 6. DOWNLOAD AND UPLOAD SPEED
# WITH TIMEOUT HANDLING
# ==========================================

def test_internet_speed():
    try:
        import speedtest

        # Shorter connection timeout
        tester = speedtest.Speedtest(timeout=8)

        tester.get_best_server()

        download = tester.download() / 1_000_000
        upload = tester.upload() / 1_000_000

        return {
            "download_mbps": round(download, 2),
            "upload_mbps": round(upload, 2),
            "status": "success"
        }

    except (TimeoutError, socket.timeout) as error:
        return {
            "download_mbps": None,
            "upload_mbps": None,
            "status": "timeout",
            "speed_test_error": str(error)
        }

    except Exception as error:
        return {
            "download_mbps": None,
            "upload_mbps": None,
            "status": "unavailable",
            "speed_test_error": str(error)
        }


# ==========================================
# 7. EXPLAINABLE DIAGNOSIS
# ==========================================

def generate_diagnosis(network, speed, local, dns):
    findings = []
    possible_causes = []
    recommendations = []

    latency = network.get("average_latency_ms")
    jitter = network.get("jitter_ms")
    packet_loss = network.get("packet_loss_percent")

    gateway_status = local.get("status")
    dns_status = dns.get("status")

    # External latency analysis

    if latency is not None:
        if latency <= 50:
            findings.append(
                "External latency is within a generally low range."
            )

        elif latency <= 100:
            findings.append(
                "Moderate external latency observed."
            )

        else:
            findings.append(
                "High external latency observed."
            )

    # Jitter analysis

    if jitter is not None:
        if jitter <= 10:
            findings.append(
                "Low measured latency variation."
            )

        else:
            findings.append(
                "Elevated latency variation observed."
            )

    # Packet loss analysis

    if packet_loss is not None:
        if packet_loss == 0:
            findings.append(
                "No packet loss observed in the external ping test."
            )

        else:
            findings.append(
                f"External packet loss observed: {packet_loss}%."
            )

    # Gateway analysis

    if gateway_status == "success":
        findings.append(
            "The default gateway responded to ping requests."
        )

    elif gateway_status == "unreachable":
        findings.append(
            "The default gateway did not respond to ping requests."
        )

        possible_causes.append(
            "Possible local network or router connectivity issue. "
            "ICMP filtering may also explain the failed ping."
        )

        recommendations.append(
            "Check Wi-Fi or Ethernet connectivity and verify "
            "that the router is powered on."
        )

    else:
        findings.append(
            "The default gateway test was unavailable."
        )

    # DNS analysis

    if dns_status == "success":
        findings.append(
            "DNS resolution completed successfully."
        )

        findings.append(
            "DNS resolution time: "
            f"{dns.get('resolution_time_ms')} ms."
        )

    elif dns_status == "failed":
        findings.append(
            "DNS resolution failed for example.com."
        )

        possible_causes.append(
            "Possible DNS resolution problem."
        )

        recommendations.append(
            "Check the configured DNS server and try resolving "
            "the domain using an alternative trusted DNS resolver."
        )

    else:
        findings.append(
            "DNS test could not be completed."
        )

    # Compare gateway and external connectivity

    if (
        gateway_status == "success"
        and network.get("status") == "unreachable"
    ):
        possible_causes.append(
            "The local gateway responded, but the external "
            "ping target did not. An upstream connectivity "
            "issue or ICMP filtering is possible."
        )

        recommendations.append(
            "Check internet connectivity and compare results "
            "with another external destination."
        )

    # Compare packet loss

    if (
        gateway_status == "success"
        and packet_loss is not None
        and packet_loss > 0
    ):
        gateway_loss = local.get("packet_loss_percent")

        if gateway_loss == 0:
            possible_causes.append(
                "External packet loss was observed while the "
                "gateway ping test showed no loss. This may "
                "indicate an upstream network issue."
            )

            recommendations.append(
                "Repeat the test at different times and "
                "compare gateway and external packet loss."
            )

        elif (
            gateway_loss is not None
            and gateway_loss > 0
        ):
            possible_causes.append(
                "Packet loss was observed in both local gateway "
                "and external connectivity tests. A local "
                "connection or router issue is possible."
            )

            recommendations.append(
                "Inspect the Wi-Fi signal, Ethernet cable "
                "and router connection."
            )

    # Speed analysis

    download = speed.get("download_mbps")
    upload = speed.get("upload_mbps")

    if download is not None:
        findings.append(
            f"Measured download speed: {download} Mbps."
        )

    if upload is not None:
        findings.append(
            f"Measured upload speed: {upload} Mbps."
        )

    if speed.get("status") in ("unavailable", "timeout"):
        findings.append(
            "Internet speed test was unavailable."
        )

    # Default explanation

    if not possible_causes:
        possible_causes.append(
            "No specific connectivity fault was established "
            "by the available tests."
        )

    if not recommendations:
        recommendations.append(
            "Continue monitoring the connection and repeat "
            "measurements if performance problems occur."
        )

    if not findings:
        findings.append(
            "Insufficient measurement data for diagnosis."
        )

    return findings, possible_causes, recommendations


# ==========================================
# 8. MAIN DIAGNOSTIC PROGRAM
# ==========================================

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--json",
        action="store_true",
        help="Return machine-readable JSON output"
    )

    args = parser.parse_args()

    test_time = datetime.now()

    if not args.json:
        print("Running NetSense AI diagnostics...")

    # Run all network tests

    local_result = test_local_network()
    network_result = test_network()
    dns_result = test_dns()
    speed_result = test_internet_speed()

    # Generate diagnosis

    (
        diagnosis,
        possible_causes,
        recommendations
    ) = generate_diagnosis(
        network_result,
        speed_result,
        local_result,
        dns_result
    )

    # Prepare final report

    final_report = {
        "timestamp": test_time.isoformat(),
        "operating_system": platform.system(),
        "local_network": local_result,
        "network_quality": network_result,
        "dns_test": dns_result,
        "internet_speed": speed_result,
        "diagnosis": diagnosis,
        "possible_causes": possible_causes,
        "recommendations": recommendations
    }

    # Save report

    report_path = (
        Path(__file__).resolve().parent
        / "diagnostic_report.json"
    )

    with open(
        report_path,
        "w",
        encoding="utf-8"
    ) as file:
        json.dump(
            final_report,
            file,
            indent=4
        )

    # JSON output for Java backend

    if args.json:
        print(json.dumps(final_report))
        return

    # Human-readable output

    print("\nNETWORK QUALITY")
    print("-" * 40)
    print(json.dumps(network_result, indent=4))

    print("\nLOCAL NETWORK / ROUTER")
    print("-" * 40)
    print(json.dumps(local_result, indent=4))

    print("\nDNS CONNECTIVITY")
    print("-" * 40)
    print(json.dumps(dns_result, indent=4))

    print("\nINTERNET SPEED")
    print("-" * 40)
    print(json.dumps(speed_result, indent=4))

    print("\nEXPLAINABLE DIAGNOSIS")
    print("-" * 40)

    for item in diagnosis:
        print("-", item)

    print("\nPOSSIBLE CAUSES")

    for item in possible_causes:
        print("-", item)

    print("\nRECOMMENDATIONS")

    for item in recommendations:
        print("-", item)

    print("\nReport saved as diagnostic_report.json")


# ==========================================
# 9. PROGRAM ENTRY POINT
# ==========================================

if __name__ == "__main__":
    main()
