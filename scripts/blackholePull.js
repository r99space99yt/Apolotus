print("BLACKHOLE PULL SCRIPT STARTED");

function setupBlackholePullLoop() {
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    const GlitchFloor = Vars.content.getByName(ContentType.block, "apolotus-GlitchFloor");

    // Retry if content not loaded yet
    if(!blackholeType || !GlitchFloor){
        Time.runTask(1, setupBlackholePullLoop);
        return;
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType + ", GlitchFloor: " + GlitchFloor);

    Time.runTask(0, function pullLoop() {
        Groups.unit.each(cons(function(u) {
            if(!u.type || u.type.name !== "apolotus-miniBlackhole") return;

            var radius = 300;
            var unitStrength = 5;
            var bulletStrength = 6;
            var maxSpeed = 300;

            // --- Pull nearby units (shield skip) ---
            Groups.unit.intersect(
                u.x - radius, u.y - radius,
                radius * 2, radius * 2,
                cons(function(v) {
                    if(!v || v.dead || v === u) return;

                    if(v.isPlayer()){
                        if(v.payload && v.payload.item && v.payload.item.name === "apolotus-ShieldBlock") return;
                        if(v.carry && v.carry.item && v.carry.item.name === "apolotus-ShieldBlock") return;
                        if(v.suitBlock) return;
                        if(v.hasSuit) return;
                        if(v._shield) return;
                    }

                    var dx = u.x - v.x;
                    var dy = u.y - v.y;
                    var dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;

                    var nx = dx / dist;
                    var ny = dy / dist;
                    var pull = unitStrength * (1 - dist / radius);

                    var vx = v.vel.x + nx * pull;
                    var vy = v.vel.y + ny * pull;

                    var speed = Math.sqrt(vx*vx + vy*vy);
                    if(speed > maxSpeed){
                        vx = vx / speed * maxSpeed;
                        vy = vy / speed * maxSpeed;
                    }

                    v.vel.set(vx, vy);
                })
            );

            // --- Pull bullets ---
            Groups.bullet.intersect(
                u.x - radius, u.y - radius,
                radius * 2, radius * 2,
                cons(function(b) {
                    if(!b) return;

                    var dx = u.x - b.x;
                    var dy = u.y - b.y;
                    var dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;

                    var nx = dx / dist;
                    var ny = dy / dist;
                    var pull = Math.min(bulletStrength * (1 - dist / radius), 15);

                    var vx = b.vel.x + nx * pull;
                    var vy = b.vel.y + ny * pull;

                    var speed = Math.sqrt(vx*vx + vy*vy);
                    var bulletMax = maxSpeed * 2;
                    if(speed > bulletMax){
                        vx = vx / speed * bulletMax;
                        vy = vy / speed * bulletMax;
                    }

                    b.vel.set(vx, vy);

                    if(dist < 20) b.remove();
                })
            );

            // --- Lightning between nearby blackholes ---
            Groups.unit.intersect(
                u.x - 400, u.y - 400,
                800, 800,
                cons(function(v2) {
                    if(!v2 || v2.dead || v2 === u || !v2.type) return;
                    if(v2.type.name === "apolotus-miniBlackhole") {
                        Fx.lightning.at(u.x, u.y, v2.x, v2.y);
                    }
                })
            );

            // --- Corrupt floor around blackhole ---
            var tileRadius = 20;
            var tileSize = Vars.tilesize;

            for(var tx = -tileRadius; tx <= tileRadius; tx++){
                for(var ty = -tileRadius; ty <= tileRadius; ty++){
                    var wx = u.x + tx * tileSize;
                    var wy = u.y + ty * tileSize;
                    var ddx = wx - u.x;
                    var ddy = wy - u.y;
                    var distt = Math.sqrt(ddx*ddx + ddy*ddy);

                    if(distt <= tileRadius * tileSize){
                        var tile = Vars.world.tileWorld(wx, wy);
                        if(tile && tile.floor()){
                            if(Math.random() < 0.005){
                                try {
                                    tile.setFloor(GlitchFloor);
                                } catch(e){
                                    print("Floor corrupt fail: " + e);
                                }
                            }
                        }
                    }
                }
            }

        }));

        Time.runTask(0, pullLoop);
    });

    print("BLACKHOLE SCRIPT LOOP READY");
}

// Initialize
if(Vars.world) {
    setupBlackholePullLoop();
} else {
    Events.on(WorldLoadEvent, cons(function() {
        setupBlackholePullLoop();
    }));
}