const fs = require('fs');
const path = require('path');
const copy = (from, to) => {
    if(!fs.existsSync(to)){
        fs.mkdirSync(to)        
    }
    fs.readdir(from,(err,files)=>{
        if(err){
            return console.error(err)
        }
        files.forEach(pathName=>{
            const fromPath = path.join(from,pathName);
            const toPath = path.join(to,pathName);
            fs.stat(fromPath, function(err, stats) {
                if(err){
                    return console.error(err)
                }
                if(stats.isFile()){
                    const readable=fs.createReadStream(fromPath);
                    const writable=fs.createWriteStream(toPath);
                    readable.pipe(writable);
                }else if(stats.isDirectory()){
                    copy(fromPath,toPath)
                }
            })
        })
    })
}
copy(path.join(__dirname,'./public'),path.join(__dirname,'./outDir/public'));