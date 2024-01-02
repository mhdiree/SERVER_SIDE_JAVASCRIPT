var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.locals.pretty = true;
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', './views_file');
app.set('view engine', 'jade');

app.get('/topic/new', function(req, res){
    fs.readdir('data', function(err, files){ //디렉터리에 있는 파일 목록 가져옴
        if(err){
            res.status(500).send('Internal Server Error')
        }
        res.render('new', {topics:files});
    });
})
app.get(['/topic', '/topic/:id'], function(req, res){ //라우터를 배열로 관리해서 중복코드 제거
    fs.readdir('data', function(err, files){ //디렉터리에 있는 파일 목록 가져옴
        if(err){
            res.status(500).send('Internal Server Error')
        }
        var id = req.params.id;
        if(id){
            //id값이 있을 때
            fs.readFile('data/'+id, 'utf8', function(err, data){
                if(err){
                   res.status(500).send('Internal Server Error');
                }
                res.render('view', {topics:files, title:id, description:data});
            })
        }else{
            res.render('view', {topics:files, title:'Welcome', description:'Hello Server'});
        }
    })
})
app.post('/topic', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title,description, function(err){
        if(err){
            res.status(500).send('Internal Server Error')
        }
        res.redirect('/topic/'+title);
    });
})

app.listen(3000, function(){
    console.log('Connected 3000');
}); //포트에 연결
