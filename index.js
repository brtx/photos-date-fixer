const sqlite3 = require('sqlite3').verbose();
var osa = require('osa2')
 
let db = new sqlite3.Database('/Users/bas/Pictures/Photos Library.photoslibrary/database/photos.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the photos database.');
});

function getDateFromAppleDate(appleDate) {
  return new Date(Date.parse(new Date(2001, 1, 1, 1, 0, 0)) + appleDate * 1000);
}

function setDate(rows) {
  return osa((_rows) => {
    const app = Application("Photos");

    var i = 1;
    _rows.forEach(row => {
      const item = app.mediaItems.byId(row.id);
      console.log(i++ + "," + item.filename() + "," + item.date() + "," + new Date(row.newDate));
      item.date = new Date(row.newDate);
    });
  })(rows)
}

db.serialize(() => {
  db.all(`
    SELECT ZADDITIONALASSETATTRIBUTES.Z_PK as pkAdd, 
           ZGENERICASSET.Z_PK as pkAss,
           ZORIGINALFILENAME as filename, 
           ZGENERICALBUM.ZTITLE as albumTitle, 
           ZALTERNATEIMPORTIMAGEDATE as fileCreatedDate, 
           ZGENERICASSET.ZDATECREATED as date, 
           ZGENERICALBUM.ZTITLE, 
           ZGENERICASSET.ZKIND, 
           ZGENERICASSET.ZDURATION, 
           ZGENERICASSET.ZUNIFORMTYPEIDENTIFIER as videoType,
           ZGENERICASSET.ZUUID as id
    FROM ZADDITIONALASSETATTRIBUTES
    INNER JOIN ZGENERICASSET
    ON ZADDITIONALASSETATTRIBUTES.Z_PK = ZGENERICASSET.ZADDITIONALATTRIBUTES
    INNER JOIN Z_26ASSETS
    ON ZGENERICASSET.Z_PK = Z_26ASSETS.Z_34ASSETS
    INNER JOIN ZGENERICALBUM
    ON Z_26ASSETS.Z_26ALBUMS = ZGENERICALBUM.Z_PK
    WHERE ZGENERICALBUM.ZTITLE = "Broken Videos"
    `, (err, rows) => {
      if (err) {
        console.error(err.message);
      }
      // console.log(i++ + "\t" + row.pkAss + "\t" + row.pkAdd + "\t" + row.filename + "\t" + row.albumTitle + "\t" + row.fileCreatedDate + "\t" + row.date + "\t" + row.videoType + "\t" + row.id);
      setDate(rows.map(row => { return { id: row.id, newDate: getDateFromAppleDate(row.fileCreatedDate) }}));
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});

// some notes:
// clear recently deleted items first => those will be recognised as well by the query, but not by jxa

// 366570014 backup date created 13.08.2012 19:00:14
// 366570014000
// 0 => 01.01.2001 1:00:00
// -31622400 => 01.01.2000 1:00:00
//  31536000 => 01.01.2002 1:00:00

// Finnland Photos haben das Datum im Namen