from adrsirlib import adrsirlib as ir

def send(no):
	data = ir.get(no)  # ボタン0のデータを取り込む
	ir.send(data) # そのデータを赤外線送信する
	print('sended. no:' + str(no))

TV_POWER_ONOFF_SWITCH_NO = 0

def tv_power_onoff():
	send(TV_POWER_ONOFF_SWITCH_NO)
	print("sended. tv_onoff")

tv_power_onoff()