var GlitchFloor = extend(Floor, {});
GlitchFloor.solid = false;
GlitchFloor.frameSpeed = 5;

// manually list your sprites
var tinySprites = [
    Core.atlas.find("error"),
    Core.atlas.find("bubble-11"),
    Core.atlas.find("metal-floor-1-edge"),
    Core.atlas.find("metal-floor-2-edge")
];

GlitchFloor.region = tinySprites[0];

GlitchFloor.draw = function(tile){
    var region = tinySprites[Math.floor(Math.random() * tinySprites.length)];
    Draw.rect(region, tile.x, tile.y);
};

Vars.content.add(GlitchFloor);
print("Random glitch floor loaded with " + tinySprites.length + " sprites :)");