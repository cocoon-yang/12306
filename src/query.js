
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
        console.log("Got response: " + res.statusCode);

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
                      console.log('Query status: ',  status );               
                  }else {
                      console.log('Query Failed ' );
                      return;
                  }

	    	var jsonMap = {};
    	 	jsonData = JSON.parse(theData).data.result;

	    	if(!jsonData||jsonData.length == 0){
	    		console.log('No free tickets');
	    		return;
	    	}





//console.log('No.\t', 'busi\t','1st\t','2nd\t','soft\t','hard\t','stand\t' );

console.log(  self._titleList.join('\t') );

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
                var businessClass = datalist[30]; 	 		     
                var firstClass = datalist[31]; 
                var secondClass = datalist[32]; 


		if(-1 != trainNum.indexOf('G') )
		{
			businessClass = datalist[30]; 		     
			firstClass = datalist[31];  
			secondClass = datalist[32];  

            		//console.log(trainNum, firstClass   );

		} else if(-1 != trainNum.indexOf('D') )
		{
 
                var standing = datalist[26]; 
            		//console.log(trainNum, tickets  );

		}else if(-1 != trainNum.indexOf('T') )
		{
			advancedSoftBerth = datalist[21]; 
 			softBerth = datalist[23]; 
			hardBerth = datalist[28];
			standing = datalist[26]; 
			hardSeat = datalist[28]; 
			softSeat = datalist[29]; 
            		//console.log(trainNum, tickets  );

		}else{

			softBerth = datalist[23]; 
			standing = datalist[26];
			hardSeat = datalist[29]; 
			softSeat = datalist[23]; 

            		//console.log(trainNum, tickets  );
		}     


		tickets.push( trainNum );
		tickets.push( departureTime );
		tickets.push( arrivalTime );
		tickets.push( durationTime );
 		tickets.push( advancedClass );
		tickets.push( businessClass );
		tickets.push( firstClass );
		tickets.push( secondClass );
		tickets.push( softBerth );
		tickets.push( hardBerth );
		tickets.push( hardSeat );
		tickets.push( softSeat );
		tickets.push( standing);



		tickets.push( );
		tickets.push( );
		tickets.push( );

	       	jsonMap[trainNum] = tickets; 
		


//console('No.\t', 'busi\t','1st\t','2nd\t' )
 console.log(tickets.join('\t' ))
 
    	    }

            //console.log('jsonMap ', jsonMap );
            // console.log('D321 ', jsonMap['D321'], ' tickets');

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
    console.log(req.data);
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
                     console.log('Query Log PASS' );
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