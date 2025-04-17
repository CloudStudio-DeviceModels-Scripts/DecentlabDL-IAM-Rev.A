function parseUplink(device, payload) {

    var payloadb = payload.asBytes();
    var decoded = decentlab_decoder.decode(payloadb);
    env.log(decoded);

    // Store battery
    if (decoded.battery_voltage != null) {
        var sensor1 = device.endpoints.byAddress("1");

        if (sensor1 != null)
            sensor1.updateVoltageSensorStatus(decoded.battery_voltage.value);
            device.updateDeviceBattery({ voltage: decoded.battery_voltage.value });
    };

    // Store temperature
    if (decoded.air_temperature != null) {
        var sensor2 = device.endpoints.byAddress("2");

        if (sensor2 != null)
            sensor2.updateTemperatureSensorStatus(decoded.air_temperature.value);
    };

    // Store humidity
    if (decoded.air_humidity != null) {
        var sensor3 = device.endpoints.byAddress("3");

        if (sensor3 != null)
            sensor3.updateHumiditySensorStatus(decoded.air_humidity.value);
    };

    // Store Air Pressure
    if (decoded.barometric_pressure != null) {
        var sensor4 = device.endpoints.byAddress("4");

        if (sensor4 != null)
            sensor4.updatePressureSensorStatus(decoded.barometric_pressure.value);
    };

    // Store Illuminance
    if (decoded.illuminance != null) {
        var sensor5 = device.endpoints.byAddress("5");

        if (sensor5 != null)
            sensor5.updateLightSensorStatus(decoded.illuminance.value);
    };

    // Store CO2
    if (decoded.co2_concentration != null) {
        var sensor6 = device.endpoints.byAddress("6");

        if (sensor6 != null)
            sensor6.updatePpmConcentrationSensorStatus(decoded.co2_concentration.value);
    };

    // Store Activity Counter
    if (decoded.activity_counter != null) {
        var sensor7 = device.endpoints.byAddress("7");

        if (sensor7 != null)
            sensor7.updateGenericSensorStatus(decoded.activity_counter.value);
    };

    // Store TVOC
    if (decoded.total_voc != null) {
        var sensor8 = device.endpoints.byAddress("8");

        if (sensor8 != null)
            sensor8.updatePpmConcentrationSensorStatus(decoded.total_voc.value);
    };


}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// Esta función permite convertir un comando de la plataforma en un
	// payload que pueda enviarse al dispositivo.
	// Más información en https://wiki.cloud.studio/page/200

	// Los parámetros de esta función, son:
	// - device: objeto representando el dispositivo al cual se enviará el comando.
	// - endpoint: objeto endpoint representando el endpoint al que se enviará el 
	//   comando. Puede ser null si el comando se envía al dispositivo, y no a 
	//   un endpoint individual dentro del dispositivo.
	// - command: objeto que contiene el comando que se debe enviar. Más
	//   información en https://wiki.cloud.studio/page/1195.

	// Este ejemplo está escrito asumiendo un dispositivo que contiene un único 
	// endpoint, de tipo appliance, que se puede encender, apagar y alternar. 
	// Se asume que se debe enviar un solo byte en el payload, que indica el tipo 
	// de operación.

/*
	 payload.port = 25; 	 	 // Este dispositivo recibe comandos en el puerto LoRaWAN 25 
	 payload.buildResult = downlinkBuildResult.ok; 

	 switch (command.type) { 
	 	 case commandType.onOff: 
	 	 	 switch (command.onOff.type) { 
	 	 	 	 case onOffCommandType.turnOn: 
	 	 	 	 	 payload.setAsBytes([30]); 	 	 // El comando 30 indica "encender" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.turnOff: 
	 	 	 	 	 payload.setAsBytes([31]); 	 	 // El comando 31 indica "apagar" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.toggle: 
	 	 	 	 	 payload.setAsBytes([32]); 	 	 // El comando 32 indica "alternar" 
	 	 	 	 	 break; 
	 	 	 	 default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	 } 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	 }
*/

}


/* https://www.decentlab.com/products/indoor-ambiance-monitor-including-co2-tvoc-and-motion-sensor-for-lorawan */

var decentlab_decoder = {
  PROTOCOL_VERSION: 2,
  SENSORS: [
    {length: 1,
     values: [{name: 'battery_voltage',
               displayName: 'Battery voltage',
               convert: function (x) { return x[0] / 1000; },
               unit: 'V'}]},
    {length: 2,
     values: [{name: 'air_temperature',
               displayName: 'Air temperature',
               convert: function (x) { return 175 * x[0] / 65535 - 45; },
               unit: '°C'},
              {name: 'air_humidity',
               displayName: 'Air humidity',
               convert: function (x) { return 100 * x[1] / 65535; },
               unit: '%'}]},
    {length: 1,
     values: [{name: 'barometric_pressure',
               displayName: 'Barometric pressure',
               convert: function (x) { return x[0] * 2; },
               unit: 'Pa'}]},
    {length: 2,
     values: [{name: 'ambient_light_visible_infrared',
               displayName: 'Ambient light (visible + infrared)',
               convert: function (x) { return x[0]; }},
              {name: 'ambient_light_infrared',
               displayName: 'Ambient light (infrared)',
               convert: function (x) { return x[1]; }},
              {name: 'illuminance',
               displayName: 'Illuminance',
               convert: function (x) { return Math.max(Math.max(1.0 * x[0] - 1.64 * x[1], 0.59 * x[0] - 0.86 * x[1]), 0) * 1.5504; },
               unit: 'lx'}]},
    {length: 3,
     values: [{name: 'co2_concentration',
               displayName: 'CO2 concentration',
               convert: function (x) { return x[0] - 32768; },
               unit: 'ppm'},
              {name: 'co2_sensor_status',
               displayName: 'CO2 sensor status',
               convert: function (x) { return x[1]; }},
              {name: 'raw_ir_reading',
               displayName: 'Raw IR reading',
               convert: function (x) { return x[2]; }}]},
    {length: 1,
     values: [{name: 'activity_counter',
               displayName: 'Activity counter',
               convert: function (x) { return x[0]; }}]},
    {length: 1,
     values: [{name: 'total_voc',
               displayName: 'Total VOC',
               convert: function (x) { return x[0]; },
               unit: 'ppb'}]}
  ],

  read_int: function (bytes, pos) {
    return (bytes[pos] << 8) + bytes[pos + 1];
  },

  decode: function (msg) {
    var bytes = msg;
    var i, j;
    if (typeof msg === 'string') {
      bytes = [];
      for (i = 0; i < msg.length; i += 2) {
        bytes.push(parseInt(msg.substring(i, i + 2), 16));
      }
    }

    var version = bytes[0];
    if (version != this.PROTOCOL_VERSION) {
      return {error: "protocol version " + version + " doesn't match v2"};
    }

    var deviceId = this.read_int(bytes, 1);
    var flags = this.read_int(bytes, 3);
    var result = {'protocol_version': version, 'device_id': deviceId};
    // decode payload
    var pos = 5;
    for (i = 0; i < this.SENSORS.length; i++, flags >>= 1) {
      if ((flags & 1) !== 1)
        continue;

      var sensor = this.SENSORS[i];
      var x = [];
      // convert data to 16-bit integer array
      for (j = 0; j < sensor.length; j++) {
        x.push(this.read_int(bytes, pos));
        pos += 2;
      }

      // decode sensor values
      for (j = 0; j < sensor.values.length; j++) {
        var value = sensor.values[j];
        if ('convert' in value) {
          result[value.name] = {displayName: value.displayName,
                                value: value.convert.bind(this)(x)};
          if ('unit' in value)
            result[value.name]['unit'] = value.unit;
        }
      }
    }
    return result;
  }
}