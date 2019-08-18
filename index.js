const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

  
  
  var username1
  var open=0
const app = express()
  .set('view engine', 'ejs')
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .get('/', (req, res) => {res.render('index')})
  .post('/', (req, res, next) => {
    
    
    res.render('game1',{ username: req.body.username});


  })
  .get('/start', (req, res) => {res.render('start')})
  .get('/cikis', (req, res) => {
    res.render('cikis1');
})
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  // app.post('/', function (req, res, next) {
  //  console.log("burda")
  // })  
  Array.prototype.sortBy = function(p) {
    return this.slice(0).sort(function(a,b) {
      return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    });
  }


  
  var io = require('socket.io')(app);
  var gamers = [
    {id:0,name: "Flint",puan:0},{id:1,name: "Mert",puan:0},{id:2,name: "Ahmet",puan:0},{id:3,name: "Mehmet",puan:0},{id:4,name: "Tuğrul",puan:0}]
    
  io.on('connection', function (socket) {


    console.log("geld bişeyler")
      
    var ans=0
        socket.on('change',(data)=>{
          var a=1
          open=1
          
          setInterval(function() {
            var x = Math.floor(Math.random() * 500)
            var y = Math.floor(Math.random() * 500)
            var z = Math.floor(Math.random()*2)
            var operation
            if(z==0) {
            ans=x-y
              operation="-"
            }
            else {
            ans=x+y
            operation="+"
            }
            console.log(gamers)
            var top=gamers.sortBy('puan')
            
          // io.sockets.emit('change1',{x:Math.floor(Math.random() * 550),y: Math.floor(Math.random() * 1300)})
          io.sockets.emit('change1',{first:x,second: y,answer:ans,gamers:top,operation:operation})
        
        },4000);
      })

      socket.on('online',(data)=>{
        var person = {id:socket.id,name:data.name,puan:0}
        gamers.push(person)
        console.log(gamers)
        io.sockets.emit('online1',{name:data.name,sayi:Object.keys(gamers).length})
      })
      socket.on('open',(data)=>{ 
        console.log("sistemin durumu"+open)
        io.to(socket.id).emit('open1', {open:open});
      
      })

      socket.on('answer',(data)=>{
        var result
        console.log(data.answer)
        if(data.answer==parseInt(data.result,10)){
          console.log("ilkte senin cevabın "+data.answer+"gerçek cevap"+data.result)
          result="cevap doğru"
          /////////////////////////////////////
          var temp
          var result1 = gamers.find(obj => {
            return obj.id === data.socketid })
            
          result1.puan=result1.puan+5
          temp=result1.puan.toString(10)
          io.to(data.socketid).emit('hey', {message:result,puan:temp});
        }
        else {
          // console.log("ikincide senin cevabın "+data.answer+"gerçek cevap"+data.result)
          // result="cevap yanlış"
          var temppuan
          var result1 = gamers.find(obj => {
            return obj.id === data.socketid })
            
            console.log(result1)
            console.log(result1.puan)
          temppuan=result1.puan
          var removeIndex = gamers.map(function(item) { return item.id; }).indexOf(socket.id);

          // remove object
          gamers.splice(removeIndex, 1);
          // var index = gamers.map(function(item) { return item.id; })
          // .indexOf(no);
          // gamers.splice(index, 1);
          // console.log("silinmiş hali"+gamers)
          console.log("yanlis"+gamers)
          io.to(data.socketid).emit('cikis', {message:result,puan:temppuan});
          //window.location.replace("/cikis")
        }
        
      })

      socket.on('kapanma',(data)=>{
        // console.log("kapanan id"+data.id)
        // var no=parseInt(data.id,10)
        // console.log("silinen no"+no)
        // var index = gamers.map(function(item) { return item.id; })
        // .indexOf(no);
        // gamers.splice(index, 1);
        //   console.log("çıkış hali"+gamers)
        
          
        // var removeIndex = gamers.map(function(item) { return item.id; }).indexOf(socket.id);
        
        // // remove object
        // gamers.splice(removeIndex, 1);
        // console.log("kapanma"+gamers)
          
  
           
    })
  })
    
  
  
  
