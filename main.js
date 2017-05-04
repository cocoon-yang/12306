const readline = require('readline');
var fs = require('fs');
var util = require('util');
var Ticketsquery = require('./src/query.js');
var STATIONDATA = require('./src/station.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> '
});


//
var stations  = new STATIONDATA() ;
var theQuery = new Ticketsquery();
 

function setTrain()
{
    rl.question('请输入车次(例如:D321):', function(answer){
       try{
	stations.setTrainNumber( answer );
       }
	catch(err)
	{
	    console.log(err);
	}
        rl.prompt();
    });
}
 
function setDate()
{
    rl.question('请输入时间(例如:2017-03-04):', function(answer)  {
       try{
	stations.setDate( answer );
       }
	catch(err)
	{
	    console.log(err);
	}
        rl.prompt();
    });
}

function fromStation()
{ 
    rl.question('请输入出发站(全拼，例如:beijingxi):', function(answer)  {
    console.log('出发站:', answer  );
    var theFromStation = answer; 

       try{
	stations.setFromStation( theFromStation );
       }
	catch(err)
	{
	    console.log(err);
	}

        rl.prompt();
    });
    //rl.prompt();
}


function toStation()
{ 
    rl.question('请输入到达站(全拼，例如beijingxi):', function(answer)  {
 	 //  
    console.log('到达站:', answer  );
    var theToStation = answer; 

       try{
	stations.setToStation( theToStation );
       }
	catch(err)
	{
	    console.log(err);
	}

        rl.prompt();
    });
    //rl.prompt();
}


rl.prompt();

rl.on('line', function(line){
  switch(line.trim()) {
    case 'quit':
      // console.log('world!');
	rl.close();
      break;
    case 'from':
      fromStation();
      break;
    case 'to':
      toStation();
      break;
    case 'date':
      setDate();
      break; 
    case 'train':
      setTrain();
      break;
    default:
      //console.log(`Say what? I might have heard '${line.trim()}'`);

      var config;
      try{
				if( ! stations.check() )
      	{
      		break;
      	}
      	config = stations.getTicketConfig();
      }catch( err )
      {
      	console.log( err );
      	//rl.prompt();
      	break;
      }
	    theQuery.log( config );
      break;
  }
  rl.prompt();
});

rl.on('close', function()  {
  console.log('Have a great day!');
  process.exit(0);
});


 



