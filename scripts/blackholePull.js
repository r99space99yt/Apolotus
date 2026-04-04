print("BLACKHOLE PULL SCRIPT STARTED");

function setupBlackholePullLoop(){
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        Time.runTask(1, setupBlackholePullLoop);
        return;
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType);

    Time.runTask(0, function pullLoop(){
        Groups.unit.each(cons(u => {
            if(!u.type || u.type.name !== "apolotus-miniBlackhole") return;

            const radius = 300;
            const unitStrength = 5;
            const bulletStrength = 6;
            const maxSpeed = 300;

            // --- Pull units (skip players carrying shield/suit) ---
            Groups.unit.intersect(
                u.x - radius, u.y - radius,
                radius*2, radius*2,
                cons(v => {
                    if(!v || v.dead || v === u) return;

                    // Skip players carrying shield/suit safely
                    if(v.isPlayer()){
                        if(v.payload && v.payload.item && v.payload.item.name === "apolotus-ShieldBlock") return;
                        if(v.carry && v.carry.item && v.carry.item.name === "apolotus-ShieldBlock") return;
                        if(v.suitBlock) return;
                        if(v.hasSuit) return;
                        if(v._shield) return;
                    }

                    // Pull calculation
                    const dx = u.x - v.x;
                    const dy = u.y - v.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;

                    const nx = dx / dist;
                    const ny = dy / dist;
                    const pull = unitStrength * (1 - dist / radius);

                    let vx = v.vel.x + nx * pull;
                    let vy = v.vel.y + ny * pull;

                    const speed = Math.sqrt(vx*vx + vy*vy);
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
                radius*2, radius*2,
                cons(b => {
                    if(!b) return;

                    const dx = u.x - b.x;
                    const dy = u.y - b.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;

                    const nx = dx / dist;
                    const ny = dy / dist;
                    const pull = Math.min(bulletStrength * (1 - dist / radius), 15);

                    let vx = b.vel.x + nx * pull;
                    let vy = b.vel.y + ny * pull;

                    const speed = Math.sqrt(vx*vx + vy*vy);
                    const bulletMax = maxSpeed * 2;
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
                cons(v => {
                    if(!v || v.dead || v === u || !v.type) return;
                    if(v.type.name === "apolotus-miniBlackhole"){
                        Fx.lightning.at(u.x, u.y, v.x, v.y);
                    }
                })
            );

            // --- Corrupt nearby floor (20 tiles radius safely) ---
            const tileRadius = 20;
            const tileSize = Vars.tilesize;

            for(let tx = -tileRadius; tx <= tileRadius; tx++){
                for(let ty = -tileRadius; ty <= tileRadius; ty++){
                    const wx = u.x + tx * tileSize;
                    const wy = u.y + ty * tileSize;
                    const dist = Math.sqrt((wx - u.x)**2 + (wy - u.y)**2);
                    if(dist <= tileRadius * tileSize){
                        const tile = Vars.world.tileWorld(wx, wy);
                        if(tile != null && tile.floor() != null && Math.random() < 0.005){
                            try{
                                tile.setFloor(Blocks.empty);
                            } catch(e){
                                print("Failed to set floor at " + wx + ", " + wy + ": " + e);
                            }
                        }
                    }
                }
            }

        }));

        // Schedule next tick
        Time.runTask(0, pullLoop);
    });

    print("BLACKHOLE SCRIPT LOOP READY");
}

if(Vars.world != null){
    setupBlackholePullLoop();
} else {
    Events.on(WorldLoadEvent, cons(() => setupBlackholePullLoop()));
}