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

### cron
```bash
# enable record cron log. search cron line and remove comment out
sudo vim /etc/rsyslog.conf

# confirm cron log
sudo cat /var/log/cron.log

# test cron
#*/1 * * * * /home/pi/Source/smarthome/shell.sh
#*/1 * * * * echo "hello" >> /home/pi/Source/test.txt

# startup cron
@reboot /home/pi/Source/smarthome/starthomeapp.sh

# grant permission
chmod +x /home/pi/Source/smarthome/starthomeapp.sh

```

### todo
- daemonize homeapp.py. use supervisor.
- migrate relative path.
- multi-parameter support
