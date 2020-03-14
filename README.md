## smarthome
alexa->awslambda->awsiot->raspberrypi->infraredsensor

### alexa
- create custom skill.

### aws lambda
- create lambda.
- template:alexa-skills-kit-nodejs-factsskill
- set ARN to alexa custom skill endpoint.
- create role:AWSIoTDataAccess,AmazonAPIGatewayPushToCrowdLogs
- edit lambda folder source:endpoints = aws iot endpoint
- deploy.

### aws iot
- create policy.
- regist raspberrypi.
- download cert,key,rootCA.

### raspberrypi
- edit homeapp.py:cert,key,endpoint,subprocessshell.
```bash
pip install paho.mqtt
pip install smbus
# run mqtt receiver
python3.5 homeapp.py
# run control infraredsensor
python3.5 main.py
```

### infraredsensor
- made by bit-trade-one. ADRSIR
- train infrared with the physical learning button in advance.
- export trained data using adrsirlib.(irdata folder)
```bash
# export example.
./ircontrol store 0:power 1:volume_up 2:volume_down
```

### systemd
```bash
chmod +x /home/pi/Source/smarthome/starthomeapp.sh
sudo -s
vi /etc/systemd/system/homeapp.service
```

homeapp.service value.
!user section is important
```vi
[Unit]
Description = homeapp daemon

[Service]
ExecStart = /home/pi/Source/smarthome/starthomeapp.sh
Restart = always
Type = simple
User=pi

[Install]
WantedBy = multi-user.target
```

```bash
sudo systemctl enable homeapp.service
sudo systemctl start homeapp.service
sudo systemctl status homeapp.service
journalctl -u homeapp.service
```

### todo
- migrate relative path.
- multi-parameter support