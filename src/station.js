var fs = require('fs');
var stations  = fs.readFileSync('./src/station.json');

var STATION = function( ) 
{  
	this.stationName = JSON.parse( stations ).stationName // .status;
	this.stationInfo  = JSON.parse( stations ).stationInfo ;

	this.config = {
	    time:'',   // date
	    from_station:'',  // from station 
	    end_station:'',   // target station
	    train_num:'',    // train number
	    purpose_codes: 'ADULT', 
	}
};  


STATION.prototype.setTrainNumber = function( theTrain )
{
	var self = this;
	self.config.train_num = theTrain;
}

STATION.prototype.getStationInfo = function( theName )
{
	var self = this; 
	var info;
	try{
		info = self.stationInfo[theName];
	}catch(err){
		console.log( err );
	}
	return info;
}


STATION.prototype.checkStation = function( theName )
{
	var self = this;
	var len = String(self.stationName).length;

	for( var i = 0; i < len; i++  )
	{
		var name = self.stationName[i]
		var targetStationNameLen = theName.length;
		var checkingStationNameLen = name.length;
		if( name.match( theName ) && (targetStationNameLen == checkingStationNameLen ))
		{
               		//console.log('find the station: \n', self.stationInfo[name].code);
			return true;
		}
	}
        console.log('can not find the station.');
	return false;
}


STATION.prototype.setDate = function( theDate )
{
	// TODO  checking theDate
	var self = this;
	self.config.time = theDate;
}

STATION.prototype.setFromStation = function( stationName )
{
      var self = this;
      var right = self.checkStation( stationName )
      if( !right ) 
      {
		throw new Error('Please input from station with promotion >from ');
		return;
      }
     var stationInfo = self.getStationInfo( stationName )
     self.config.from_station = stationInfo.code;
}

STATION.prototype.setToStation = function( stationName )
{
      var self = this;
      var right = self.checkStation( stationName )
      if( !right ) 
      {
		throw new Error('Please input from station with promotion >to ');
		return;
      }
	var stationInfo = self.getStationInfo( stationName )
     self.config.end_station = stationInfo.code;
}

STATION.prototype.check = function( )
{
	var self = this;
	var station = self.config.from_station;

	var len = String(station).length;
 
	if( 0 == len ) 
	{
		throw new Error('请先设定出发站 >from ');
		return false; 
	} 

	station = self.config.end_station;
	len = String(station).length;
	if( 0 == len ) 
	{
		throw new Error('请先设定到达站 >to ');
		return false; 
	} 

	var date = self.config.time;
	len = String(station).length;
	if( 0 == len ) 
	{
		throw new Error('请先设定发车时间 >date ');
		return false; 
	} 
/*******
	var train = self.config.train_num;
	len = train.length;
	if( 0 == len ) 
	{
		throw new Error('请先设定车次 >train ');
		return false; 
	} 
***********/	
	return true; 
}

STATION.prototype.getTicketConfig = function( )
{
	var self = this;
//  DEBUG  
console.log( self.config );
//

	try{
		self.check();
	}catch(err){
		console.log(err);
		return self.config; 
	}
	return self.config;
}

module.exports = STATION;
