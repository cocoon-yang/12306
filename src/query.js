// Copyright 2017 Chunfeng Yang
// This code may be freely used and modified for any purpose
// providing that this copyright notice is included with it.
// SoftSurfer makes no warranty for this code, and cannot be held
// liable for any real or imagined damage resulting from its use.
// Users of this code must verify correctness for their application.

var https = require('https');
var fs = require('fs');
var ca = fs.readFileSync('./cert/srca.cer.pem');

var UA = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";

var QUERY = function( ) 
{  
	this._titleList = new Array(); 
	this._titleList.push( '车次');
	this._titleList.push( '开车');
	this._titleList.push( '到达');
	this._titleList.push( '历时');
	this._titleList.push( '商务');
	this._titleList.push( '一等');
	this._titleList.push( '二等');
	this._titleList.push( '软卧');
	this._titleList.push( '硬卧');
	this._titleList.push( '软座');
	this._titleList.push( '硬座');
	this._titleList.push( '站票');

};

QUERY.prototype.fixedlengthString = function( theStr, length )
{
    var strlen = 0;
    for(var i = 0;i < theStr.length; i++)
　　{
　　　　if(theStr.charCodeAt(i) > 255)  
　　　　　　strlen += 2;
　　　　else  
　　　　　　strlen++;
    }

    if( strlen < length )
    {
        var strlist = new Array();
        strlist.push( theStr );
        for( var i = strlen; i < length; i++ )
        {
             strlist.push( ' ' );
        }
        return strlist.join('');
    } else {
        return theStr.substr(0,length);
    }
}

QUERY.prototype.query = function( config )
{
      var self = this;

    var queryPath = '/otn/leftTicket/query?';
        queryPath +=  'leftTicketDTO.train_date='   +  config.time;
        queryPath += '&leftTicketDTO.from_station=' +  config.from_station; 
        queryPath += '&leftTicketDTO.to_station='   +  config.end_station; 
        queryPath += '&purpose_codes='              +  config.purpose_codes;

    var queryOptions = { 
            method: 'GET',
            hostname: 'kyfw.12306.cn',//12306
            path:  queryPath,
           // rejectUnauthorized: false  //  
            ca:[ca]//证书
    };


    /*
     * Request header parameters
     */
    var options = { 
	    hostname: 'kyfw.12306.cn',//12306
	    port:443,
	    method:'GET',
	    path: queryPath ,
	    ca:[ca],// 
	    headers:{
	      'Connection':'keep-alive',
	      'Host':'kyfw.12306.cn',
	      'User-Agent': UA,
	      "Connection":"keep-alive",
	      "Referer":"https://kyfw.12306.cn/otn/leftTicket/init",
	      "Cookie":"__NRF=D2A7CA0EBB8DD82350AAB934FA35745B; JSESSIONID=0A02F03F9852081DDBFEA4AA03EF4252C569EB7AB1; _jc_save_detail=true; _jc_save_showIns=true; BIGipServerotn=1072693770.38945.0000; _jc_save_fromStation=%u77F3%u5BB6%u5E84%2CSJP; _jc_save_toStation=%u5408%u80A5%2CHFH; _jc_save_fromDate=2017-02-17; _jc_save_toDate=2017-01-19; _jc_save_wfdc_flag=dc",
    	}
    };


    var req = https.get( options, function(res){ 
        res.setEncoding('utf8');
        // console.log("Got response: " + res.statusCode);

        var theData = '';
        res.on('data',function( chunk ){
            theData += chunk;             
            if ( theData.length > 1e6) { 
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
        }); 

        res.on('end',function(){  
    	    var jsonData;
    	    try{
                 var status = JSON.parse(theData).status;
                 if( status )
                 {
                      // console.log('Query status: ',  status );               
                  }else {
                      console.log('Query Failed ' );
                      return;
                  }

	    	var jsonMap = {};  
		try{
    	 		jsonData = JSON.parse(theData).data.result;
		} catch( err ) {
			//console.error( err );
			console.log( JSON.parse(theData).messages );
			return;
		}

	    	if(!jsonData||jsonData.length == 0){
	    		console.log('No free tickets');
	    		return;
	    	}

console.log(  self._titleList.join('  ') );
		    
    	     for(var i=0;i<jsonData.length;i++){
    		var theTrain = jsonData[i];
		var  datalist = theTrain.split('|') ;
		var tickets = new Array();
		     
                var trainNum = datalist[3]; 
		var departureTime = datalist[8];
		var arrivalTime = datalist[9];
		var durationTime = datalist[10];
                var date = datalist[13]; 
 
		var advancedSoftBerth = datalist[21]; 
		var softBerth = datalist[23];
		var hardBerth = datalist[28];  

                var softSeat = 0;     
                var hardSeat = datalist[29]; 
                var standing = datalist[26]; 

                var advancedClass = datalist[25]; 
                var businessClass = datalist[32]; 	 		     
                var firstClass = datalist[30]; 
                var secondClass = datalist[31]; 
       

 

		if(-1 != trainNum.indexOf('G') )
		{
		} else if(-1 != trainNum.indexOf('D') )
		{
		}else if(-1 != trainNum.indexOf('T') )
		{
			advancedSoftBerth = datalist[21]; 			
		}else{

		}   
		tickets.push( self.fixedlengthString( trainNum, 6 ) );
		tickets.push( self.fixedlengthString( departureTime, 6 ) );
		tickets.push( self.fixedlengthString( arrivalTime, 6 ) );
		tickets.push( self.fixedlengthString( durationTime, 6 ) );

 		//tickets.push( advancedClass );
		tickets.push( self.fixedlengthString( businessClass, 6 ) );
		tickets.push( self.fixedlengthString( firstClass, 6 ) );
		tickets.push( self.fixedlengthString( secondClass, 6 ) );
		tickets.push( self.fixedlengthString( softBerth, 6 ) );
		tickets.push( self.fixedlengthString( hardBerth, 6 ) );
		tickets.push( self.fixedlengthString( softSeat, 6 ) );
		tickets.push( self.fixedlengthString( hardSeat, 6 ) );
		tickets.push( self.fixedlengthString( standing, 6 ) );

 console.log(tickets.join('' )); 
    	    }

    	    }catch(err){
    		console.log('JSON data error',err);
    		return;
    	    }

    	    if(!jsonData||jsonData.length == 0){
    	    	console.log('No message of the ticket');
    		return;
    	    }
         })
    })

    req.on('error', function(err){
        console.error(err.code);
        console.log('problem with request: ' + e.message);
    });

    req.end();
    console.log( );
}




QUERY.prototype.log = function( config )
{
      var self = this;


    var theLogPath = '/otn/leftTicket/log?';
    theLogPath += 'leftTicketDTO.train_date=' +  config.time;
    theLogPath += '&leftTicketDTO.from_station=' +  config.from_station; 
    theLogPath += '&leftTicketDTO.to_station=' +  config.end_station; 
    theLogPath += '&purpose_codes=' +  config.purpose_codes;
 
    // console.log( theLogPath )

    var logOptions = { 
        method: 'GET',
        hostname: 'kyfw.12306.cn',//12306
        path:  theLogPath,
        // rejectUnauthorized: false  //  
        ca: [ca]//证书
    };

    var req = https.get( logOptions, function(res){ 
 
        var data = '';
        res.on('data',function(buff){
            data += buff; 
        }); 

        res.on('end',function(){
               //console.log('log res',data);

    	    try{
                var status = JSON.parse(data).status;
                if( status )
                {
                     //console.log('Query Log PASS' );
                     self.query( config );
                 }else {
                     console.log('Query Log Failed ' );
                     return;
                 }
    	    }catch(err){
    		console.log('Logging, JSON data error, ',err);
    		return;
    	    }
        })
    })

    req.on('error', function(err){
        console.error('Log error:', err.code);
    });
}









module.exports = QUERY;
