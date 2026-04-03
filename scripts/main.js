print("SCRIPT STARTED");

function setupBlackholePullLoop(){
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        Time.runTask(1, setupBlackholePullLoop); // retry next tick if not loaded
        return;
    }

    const shieldBlock = Vars.content.getByName(ContentType.block, "apolotus-ShieldBlock");
    if(!shieldBlock){
        print("❌ SHIELD BLOCK NOT FOUND");
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType);

    Time.runTask(0, function pullLoop(){
        Groups.unit.each(cons(u => {
            if(u.type !== blackholeType) return; // only pull from blackholes

            let radius = 300;
            let unitStrength = 5;
            let bulletStrength = 6; // smaller to prevent spaghettification
            let maxSpeed = 300;

            // --- Pull units ---
            Groups.unit.intersect(
                u.x - radius, u.y - radius,
                radius*2, radius*2,
                cons(v => {
                    if(!v || v.dead || v === u) return;

                    // Check immunity: carrying shield or Mega/Emanate block
                    let immune = false;
                    if(shieldBlock && v.stack && v.stack.hasItem(shieldBlock)) immune = true;
                    if(v.build && v.build.block == shieldBlock) immune = true; // if standing on it
                    if(v.isImmuneToGravity) immune = true; // optional flag for Mega/Emanate
                    if(immune) return;

                    let dx = u.x - v.x;
                    let dy = u.y - v.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;
                    dx /= dist; dy /= dist;
                    let pull = unitStrength * (1 - dist/radius);

                    let vx = v.vel.x + dx * pull;
                    let vy = v.vel.y + dy * pull;
                    let speed = Math.sqrt(vx*vx + vy*vy);
                    if(speed > maxSpeed){ vx = vx / speed * maxSpeed; vy = vy / speed * maxSpeed; }

                    v.vel.set(vx, vy);
                })
            );

            // --- Pull bullets ---
            Groups.bullet.intersect(
                u.x - radius, u.y - radius,
                radius*2, radius*2,
                cons(b => {
                    if(!b) return;
                    let dx = u.x - b.x;
                    let dy = u.y - b.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;
                    dx /= dist; dy /= dist;

                    let pull = bulletStrength * (1 - dist/radius);
                    pull = Math.min(pull, 15); // cap pull

                    let vx = b.vel.x + dx * pull;
                    let vy = b.vel.y + dy * pull;
                    let speed = Math.sqrt(vx*vx + vy*vy);
                    let bulletMax = maxSpeed*2;
                    if(speed > bulletMax){ vx = vx / speed * bulletMax; vy = vy / speed * bulletMax; }

                    b.vel.set(vx, vy);

                    if(dist < 20) b.remove(); // consume close bullets
                })
            );
        }));

        Time.runTask(0, pullLoop); // loop next tick
    });

    print("BLACKHOLE SCRIPT LOOP READY");
}

// Run immediately if world loaded, else wait
if(Vars.world != null){
    setupBlackholePullLoop();
} else {
    Events.on(WorldLoadEvent, cons(() => setupBlackholePullLoop()));
}