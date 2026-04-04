var GlitchFloor = extend(Floor, {});
GlitchFloor.solid = false;
GlitchFloor.frameSpeed = 5;

// Collect tiny sprites safely
var tinySprites = [];
try {
    Core.atlas.getRegions().each(r => {
        if(r.width <= 32 && r.height <= 32) tinySprites.push(r);
    });
} catch(e){
    print("Failed to get regions: " + e);
}

// Fallback
if(tinySprites.length == 0) tinySprites.push(Core.atlas.find("error"));
GlitchFloor.region = tinySprites[0];

// Override draw method safely
GlitchFloor.draw = function(tile){
    if(tinySprites.length == 0) return;
    var region = tinySprites[Math.floor(Math.random() * tinySprites.length)];
    Draw.rect(region, tile.x, tile.y); // use tile.x / tile.y for compatibility
};

Vars.content.add(GlitchFloor);
print("Random glitch floor loaded with " + tinySprites.length + " tiny sprites :)");