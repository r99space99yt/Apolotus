// GlitchFloor.js - safe version

const glitchSprites = [
    "error",
    "block-dark-metal-full",
    "bubble-11",
    "metal-floor-4-edge",
    "metal-floor-3-edge",
    "metal-floor-2-edge",
    "metal-floor-1-edge"
].map(Core.atlas.find).filter(r => r != null);

var GlitchFloor = JavaAdapter(Floor, {}, {
    draw: function(tile){
        if(!tile) return;
        if(glitchSprites.length === 0) return;

        // Pick random sprite
        var region = glitchSprites[Math.floor(Math.random() * glitchSprites.length)];
        if(!region) return;

        // Safe draw
        Draw.rect(region, tile.worldx(), tile.worldy(), tile.width(), tile.height());
    },
    load: function(){
        try {
            // Ensure at least the first sprite is loaded for the Floor
            this.region = glitchSprites[0] || Core.atlas.find("error");
        } catch(e){
            print("GlitchFloor load fail: " + e);
        }
    }
});

// Optional properties
GlitchFloor.frameSpeed = 5;
GlitchFloor.solid = false;

Vars.content.add(GlitchFloor);
print("Glitch floor loaded safely :)");