import paho.mqtt.client
import ssl
import subprocess
import json


endpoint = ""
port = 8883
topic_to = "homeapp/to"
topic_from = "homeapp/from"
rootCA = "AmazonRootCA1.pem"
cert = "xxx-certificate.pem.crt"
key = "xxx-private.pem.key"
subprocessshell = '/home/pi/Source/smarthome/ir.sh'

# def on_connect(client, userdata, flags, respons_code):
def on_connect(client, userdata, flags, respons_code):
    print("connected")
    client.subscribe(topic_to)


def on_message(client, userdata, msg):
    print("received:" + msg.payload.decode("utf-8"))
    # data = json.loads(msg.payload.decode("utf-8"))
    # par = data["resource"] + "_" + data["command"] + ("_" + data["parameters"] if data["parameters"] else "")
    # subprocess.call("/bin/bash ir.sh " + par, shell=True)
    print("calling subprocess.")
    subprocess.call(subprocessshell)
    print("called subprocess.")


if __name__ == '__main__':
    client = paho.mqtt.client.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.tls_set(rootCA, certfile=cert, keyfile=key, cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)
    client.connect(endpoint, port=port, keepalive=60)
    print("start script")
    client.loop_forever()