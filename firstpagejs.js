var express=require('express');
var mysql=require('mysql');
var session=require('express-session');
var app =express();
var bodyParser = require('body-parser');
app.use(express.static('public'));

app.engine('html', require('ejs').renderFile);


app.use(session({secret: 'yahoo',saveUninitialized: false,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));


app.get('/',function(req,res){
	res.render('firstpage.html');
	});

app.get('/check',function(req,res){
	console.log("checking the user name and password ");
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
		con.query('select emppass ,empname from login where empname=?',[req.query.user],function(err,result,fields){
			//console.log(result[0].emppass);
			//console.log(result[0].empname);
			//console.log(result);
			//var uname=req.query.user;
			//var passo=req.query.pass
			if(result!=""){
			if( result[0].emppass=='1234' && result[0].empname=='admin'){
			 res.end('done');
			}
			
			else if(result[0].emppass=='123' && result[0].empname=='mayank')
			{
			res.end('purchase');
			}
			else{
				res.end('undone');
			}
			}
			else{
				//res.redirect('/invalid');
				res.end('undone');
			
			}
		});
	});
	
});

app.get('/sess',function(req,res){
var sess = req.session;
if(sess.user) {
   res.sendFile(__dirname+'/admin.html');
	console.log("sess.user");
} 
else {
    res.render('firstpage.html');
	console.log("sending first page");
}
});

app.get('/admin',function(req,res){
	console.log('reached admin page');
   res.sendFile(__dirname+'/views/admin.html');
  //res.render('admin.html');
   }); 
   
   app.get('/purchas',function(req,res){
	console.log('reached admin page');
   res.sendFile(__dirname+'/views/purchase.html');
  //res.render('admin.html');
   }); 

app.post('/login',function(req,res){
	sess=req.session;	
	sess.user=req.body.params.user;
	sess.pass=req.body.params.pass;
	console.log("session username and password  printing")
	console.log(req.body.params.user)
	console.log(req.body.params.pass)
	res.end('done');
});


app.get('/data',function(req,res){
	console.log(" data  sending to table");
	sess=req.session;	
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
		con.query('select * from item',function(err,result,fields){
			console.log('data selected');
			console.log(JSON.stringify(result));
			res.send(JSON.stringify(result));
		});
			
		});
	});




app.get('/insert',function(req,res){
	console.log("manipulating data ");
	sess=req.session;	
	sess.itemid=req.query.itemid;
	sess.itemcode=req.query.itemco;
	sess.itemdesc=req.query.itemdesc;
	sess.itemqu=req.query.itemqu;
	sess.itempr=req.query.itempr;
	console.log(sess.itempr);
	console.log(sess.itemid);
	console.log(sess.itemdesc);
	console.log(sess.itemqu);
	console.log(sess.itemcode);
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
		con.query('insert into item (itemid,itemcode,item,quantity,price) values(null,?,?,?,?);',[sess.itemcode,sess.itemdesc,sess.itemqu,sess.itempr],function(err,result,fields){
			console.log('inserted into the table ');
				console.log(JSON.stringify(result));
		});
			con.query('select * from item',function(err,result,fields){
			console.log('data selected');
			console.log(JSON.stringify(result));
			res.send(JSON.stringify(result));
			
		});
	});
	
});





app.get('/delete',function(req,res){
	console.log("manipulating data ");
	sess=req.session;	
	sess.itemdo=req.query.itemdo;
	console.log(sess.itemdo);
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
		con.query('delete from item where itemid=?;',[sess.itemdo],function(err,result,fields){
			console.log('deleted from the table ');
				console.log(JSON.stringify(result));
		});
			con.query('select * from item',function(err,result,fields){
			console.log('data selected');
			console.log(JSON.stringify(result));
			res.send(JSON.stringify(result));
			
		});
	});
	
});


app.get('/update',function(req,res){
	console.log("manipulating data ");
	sess=req.session;	
	sess.itemids=req.query.itemids;
	sess.itemcodes=req.query.itemcos;
	sess.items=req.query.items;
	sess.itemqus=req.query.itemqus;
	sess.itemprs=req.query.itemprs;
	console.log(sess.itemids);
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
		con.query('update item set itemcode=?,item=?,quantity=?,price=? where itemid=? ;',[sess.itemcodes,sess.items,sess.itemqus,sess.itemprs,sess.itemids],function(err,result,fields){
			console.log('updated from the table ');
				console.log(JSON.stringify(result));
		});
			con.query('select * from item',function(err,result,fields){
			console.log('data selected');
			console.log(JSON.stringify(result));
			res.send(JSON.stringify(result));
			
		});
	});
	
});

app.get('/pur',function(req,res){
	console.log("purchasing data ");
	sess=req.session;	
	sess.itemidi=req.query.itemidi;
	sess.qty=req.query.qty;
	sess.address=req.query.address;
	sess.pincode=req.query.pincode;
	sess.phone=req.query.phone;
	console.log(sess.itemidi);
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
			con.query('select * from item where itemid=?',[sess.itemidi],function(err,result,fields){
			console.log('data selected');
			//console.log(result);
			
			sess.pitemco=result[0].itemcode;
			sess.pitem=result[0].item;
			sess.pitemqu=sess.qty;
			sess.pitempr=result[0].price*sess.qty;
			const code = result[0].itemcode;
			const item=result[0].item;
			const qty=sess.qty;
			const prod=result[0].price*sess.qty;
			const id=sess.itemidi;
			console.log(code);
            console.log(item);
			console.log(qty);
			console.log(prod);
			console.log(id);
			console.log(result[0].itemcode);
			
			con.query('insert into finalpurchase(itemid,itemcode,item,qty,finalprice) values(?,?,?,?,?)',[sess.itemidi,sess.pitemco,sess.pitem,sess.qty,sess.pitempr],
			function(err,result1,fields){
				console.log('data inserted finalpurchase');
			
			if(result1!=""){
			res.send(JSON.stringify(result1));
			}
			else
			{
			res.render('purchase.html');
			}
			 
		});
		});
	});
	});

app.get('/final',function(req,res){
	sess=req.session;
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
		
	console.log(sess.itemidi);
  con.query('select * from finalpurchase',
  function(err,result,fields){
	res.send(JSON.stringify(result));
  })
});
});

app.get('/remove',function(req,res){
	var item = req.query.item;
	console.log("okk"+item);
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
		con.connect('delete from finalpurchase where item=?',[item],function(err,result,fields){
			res.sennd(JSON.stringify(result));
		})
	
});
});
app.get('/payedata',function(req,res){
	console.log('reached payment page');
	var con=mysql.createConnection({
		host:'localhost',
		user:'root',
		password:"admin",
		database:"saleitem"
	});
	con.connect(function(err){
		if(err) throw err;
  con.query('select * from finalpurchase where itemid=?',[sess.itemidi],function(err,result,fields){
			console.log('data selected');
			res.send(JSON.stringify(result));
   });
});
});
   
   
   app.get('/paye',function(req,res){
	console.log('reached data send ');
   res.sendFile(__dirname+'/views/payment.html');
   
   
   }); 

app.get('/payment',function(req,res){
	console.log(" payment succesfull");
	sess=req.session;
	
			res.sendFile(__dirname+'/views/itempurchased.html');
});


app.get('/logout',function(req,res){
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.render('logout.html');
		}
	});

});

var server =app.listen(2312,function(){
console.log('server listening at port 2312 ')
});