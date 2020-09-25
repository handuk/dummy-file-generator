const args = process.argv;
const fs = require('fs');
const path = require('path');

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function write(stream, size) {

  return new Promise(resolve => {

    let chunk = createChunk(size);

    stream.write(chunk, () => {

      chunk = null;
      resolve();

    });

  });

}

async function writeMany(stream, size, times) {

  for ( let i = 0; i < times; i++ ) {

    await write(stream, size);

  }

  return;

}

function createChunk(size) {

  const charset = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  let chunk = '';

  for ( let i = 0; i < size; i++ ) {

    chunk += charset[Math.floor(Math.random() * charset.length)];

  }

  return chunk;

}

if(args[2] && args[3]){
    let startIndex = args[2];
    let endIndex = args[3];
    for(let i = startIndex ; i <= endIndex ; i ++){
    
        let filename = 'dummy-'+i+'.txt';
        let size = getRandomIntInclusive(0, 100).toString();
        
        const bMatch = size.match(/^(\d+)$/i);
        const kbMatch = size.match(/^(\d+)kb$/i);
        const mbMatch = size.match(/^(\d+)mb/i);
        const gbMatch = size.match(/^(\d+)gb/i);
        const filepath = path.join('.', filename);
        let chunkSize = 0;
        
        if ( bMatch ) size = +bMatch[1];
        if ( kbMatch ) size = +kbMatch[1] * 1000;
        if ( mbMatch ) size = +mbMatch[1] * 1000 * 1000;
        if ( gbMatch ) size = +gbMatch[1] * 1000 * 1000 * 1000;
        
        chunkSize = Math.floor(size / 10);
        
        if ( ! chunkSize ) chunkSize = 256;
        if ( chunkSize > 10 * 1000 * 1000 ) chunkSize = 10 * 1000 * 1000;
        
        const stream = fs.createWriteStream(filepath, { highWaterMark: chunkSize });
        
        const rounds = Math.floor(size / chunkSize);
        const lastRound = size % chunkSize;
        
        writeMany(stream, chunkSize, rounds)
        .then(() => {
        
            stream.end(createChunk(lastRound), () => {
        
            });
        
        })
        .catch(console.log);
    }
}else{
    console.log('bad parameter');
}



