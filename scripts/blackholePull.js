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
            if(u.type !== blackholeType) return;

            const radius = 300;
            const unitStrength = 5;
            const bulletStrength = 6;
            const maxSpeed = 300;

            // --- Pull units (skip units with shield/suit) ---
            Groups.unit.intersect(
                u.x - radius, u.y - radius,
                radius*2, radius*2,
                cons(v => {
                    if(!v || v.dead || v === u) return;

                    // Skip shielded units (player or normal)
                    if(v.payload && v.payload.item && v.payload.item.name === "apolotus-ShieldBlock") return;
                    if(v.carry && v.carry.item && v.carry.item.name === "apolotus-ShieldBlock") return;
                    if(v.hasShieldHP) return; // a custom flag set by your suit script
                    if(v.suitBlock) return;

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
        }));

        Time.runTask(0, pullLoop);
    });

    print("BLACKHOLE SCRIPT LOOP READY");
}

if(Vars.world != null){
    setupBlackholePullLoop();
} else {
    Events.on(WorldLoadEvent, cons(() => setupBlackholePullLoop()));
}