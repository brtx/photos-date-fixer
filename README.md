# photos-date-fixer
A simple script for setting the alternate import date in Apple photos.

It takes all assets (photos and videos) from the "broken videos" album, takes the alternate import date (which should be the file creation date in most cases) and uses jxa (some java script version of apple script) to set this date on those assets.

Lately I was moving a lot of very old photos and videos into my iCloud library.
I encountered some issues, one being that a lot of videos are being imported with the incorrect date, just being set to the import date.
I researched a bit and the majority of tips online go into the direction, that you need to fix the exif information on those videos first before importing.
So I tried that, however it seems that not all video formats actually support exif.
I tried different exif tools and none were able to actually create the exif information on some of my videos.
I saw that at least some of my videos have the correct creation date set on file level, so I was wondering why photos doesn't just use that.
The photos database is based on sqlite, the scheme is not self-explanatory, but also not that complicated, so I did some digging and I found one field called ZALTERNATEIMPORTIMAGEDATE in the ZGENERICASSET table which always contained the file creation date.
Seing this name and based on some posts I read online I believe that must be some bug which possibly has been fixed before and reintroduced later on.

<tldr>
So I wrote this script which takes all assets (photos and videos) from the "broken videos" album, takes the alternate import date and uses jxa (some java script version of apple script) to set this date on those assets.
</tldr>

I created a smart album filtering for all assets without camera, imported in the last 20 days and the date also being inside the last 20 days.
That one did the trick to pretty much find all the affected videos.
Those vides then I added to the "broken videos" album, which the script operated on.
You may probably use some other filter to select the assets you want to fix.
Also my library path is hardcoded, so you need to find your library first and change that.
I would also recommend to comment out the line first which actually changes the date, I am logging some csv with all media names I am touching and old date new date, so you can check first what the script is going to do.
Also I would recommend to delete all assets from the recently deleted album, as the sqlite query also may catch items from there, however jxa doesn't find those.
For some of my videos the date is still weird, as the creation date was wrong as well, so the script won't help you in that case.
One other pitfall may be the schema, my library is icloud based, I read somewhere online it maybe completely different for local libraries.
And anyway this is a huge hack, so don't blame me if it doesn't work for you, you may want to check the schema first yourself, I used "DB browser for sqlite".
