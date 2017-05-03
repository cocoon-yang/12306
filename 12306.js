//  参考hongrunhui的node_12306：
//  https://github.com/hongrunhui/node_12306
//  编写的一个使用node.js查询12306余票的代码

var https = require('https');
var fs = require('fs');
var ca = fs.readFileSync('./cert/srca.cer.pem');

var UA = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";
var titleList = new Array();
titleList.push( '车次');
titleList.push( '开车');
titleList.push( '到达');
titleList.push( '历时');
titleList.push( '商务');
titleList.push( '一等');
titleList.push( '二等');
titleList.push( '软卧');
titleList.push( '硬卧');
titleList.push( '软座');
titleList.push( '硬座');
titleList.push( '站票');
 

var config = {
    time:'2017-05-08',   // date
    from_station:'BJP',  // from station 
    end_station:'SHH',   // target station
    train_num:'D321',    // train number
    purpose_codes: 'ADULT', 
}


function query()
{
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
            ca:[ca]// 
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

console.log(  titleList.join('\t') );		    
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
		tickets.push( trainNum );
		tickets.push( departureTime );
		tickets.push( arrivalTime );
		tickets.push( durationTime );
 		//tickets.push( advancedClass );
		tickets.push( businessClass );
		tickets.push( firstClass );
		tickets.push( secondClass );
		tickets.push( softBerth );
		tickets.push( hardBerth );
		tickets.push( hardSeat );
		tickets.push( softSeat );
		tickets.push( standing);
console.log(tickets.join('\t' ))
		     
	       	jsonMap[trainNum] = tickets; 				     
    	    }

            //console.log('jsonMap ', jsonMap );
            //console.log('D321 ', jsonMap['D321'], ' tickets');
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


function log()
{
    var theLogPath = '/otn/leftTicket/log?';
    theLogPath += 'leftTicketDTO.train_date=' +  config.time;
    theLogPath += '&leftTicketDTO.from_station=' +  config.from_station; 
    theLogPath += '&leftTicketDTO.end_station=' +  config.end_station; 
    theLogPath += '&purpose_codes=' +  config.purpose_codes;

    var logOptions = { 
        method: 'GET',
        hostname: 'kyfw.12306.cn',//12306
        path:  theLogPath,
        // rejectUnauthorized: false  //  
        ca: [ca] 
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
                     query();
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

log();
