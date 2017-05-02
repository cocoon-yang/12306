//  参考hongrunhui的node_12306：
//  https://github.com/hongrunhui/node_12306
//  编写的一个使用node.js查询12306余票的代码

var https = require('https');
var fs = require('fs');
var ca = fs.readFileSync('./cert/srca.cer.pem');

var UA = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";

 

var config = {
    time:'2017-05-03',   // date
    from_station:'BJP',  // from station 
    end_station:'SHH',   // target station
    train_num:'D321',    // train number
    purpose_codes: 'ADULT', 
}

var ca = fs.readFileSync('./cert/srca.cer.pem');

 	   

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

    	     for(var i=0;i<jsonData.length;i++){
    		var theTrain = jsonData[i];
		var  datalist = theTrain.split('|') ;

                var firstClass = 0;  
                var secondClass = 0;  
                var hardSeat = 0;  
                var softSeat = 0;   
                var trainNum = datalist[3]; 
                var date = datalist[13]; 
       
		var tickets;

		if(-1 != trainNum.indexOf('G') )
		{
			firstClass = datalist[30];  
			tickets = datalist[30];  

            		console.log(trainNum, firstClass   );

		} else if(-1 != trainNum.indexOf('D') )
		{
	       		tickets = jsonMap[trainNum] = datalist[23]; 

            		console.log(trainNum, tickets  );

		}else{
	       		tickets = jsonMap[trainNum] = datalist[30]; 

            		console.log(trainNum, tickets  );
		}     

	       	jsonMap[trainNum] = tickets; 
		
    	    }

            //console.log('jsonMap ', jsonMap );
            console.log('D321 ', jsonMap['D321'], ' tickets');

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
 
    //console.log( theLogPath )

    var logOptions = { 
        method: 'GET',
        hostname: 'kyfw.12306.cn',//12306
        path:  theLogPath,
        // rejectUnauthorized: false  // 忽略安全警告
        ca: [ca]//证书
    };

    var req = https.get( logOptions, function(res){ 
 
        var data = '';
        res.on('data',function(buff){
            data += buff;//查询结果（JSON格式）
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
