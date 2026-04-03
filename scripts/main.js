print("SCRIPT STARTED");

// === Main setup function ===
function setupBlackholeGravity(){
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        // Not ready yet, try again next tick
        Time.runTask(1, setupBlackholeGravity);
        return;
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType);

    // Attach gravity pull to a single blackhole instance
    function attach(unit){
        if(unit.blackholeAttached) return; // only attach once
        unit.blackholeAttached = true;

        const oldUpdate = unit.update;
        unit.update = function(){
            oldUpdate.call(this);

            const radius = 300;          // how far the pull reaches
            const maxUnitForce = 50;     // for units
            const maxBulletForce = 600;  // for bullets
            const maxSpeed = 30000;         // optional cap for units/bullets

            // --- Pull units ---
            Groups.unit.intersect(
                this.x - radius,
                this.y - radius,
                radius*2,
                radius*2,
                cons(u => {
                    if(!u || u.dead || u.isPlayer() || u === this) return;

                    let dx = this.x - u.x;
                    let dy = this.y - u.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;
                    dx /= dist; dy /= dist;

                    // Strength falloff
                    let pull = maxUnitForce * (1 - dist / radius);

                    // Combine original velocity + pull
                    let vx = u.vel.x + dx * pull;
                    let vy = u.vel.y + dy * pull;

                    // Limit speed
                    let speed = Math.sqrt(vx*vx + vy*vy);
                    if(speed > maxSpeed){
                        vx = vx / speed * maxSpeed;
                        vy = vy / speed * maxSpeed;
                    }

                    u.vel.set(vx, vy);
                })
            );

            // --- Pull bullets ---
            Groups.bullet.intersect(
                this.x - radius,
                this.y - radius,
                radius*2,
                radius*2,
                cons(b => {
                    if(!b) return;

                    let dx = this.x - b.x;
                    let dy = this.y - b.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;
                    dx /= dist; dy /= dist;

                    // Strength falloff
                    let pull = maxBulletForce * (1 - dist / radius);

                    // Combine original velocity + pull
                    let vx = b.vel.x + dx * pull;
                    let vy = b.vel.y + dy * pull;

                    // Limit speed
                    let speed = Math.sqrt(vx*vx + vy*vy);
                    if(speed > maxSpeed*2){ // bullets can go faster
                        vx = vx / speed * maxSpeed*2;
                        vy = vy / speed * maxSpeed*2;
                    }

                    b.vel.set(vx, vy);

                    // Destroy bullets too close
                    if(dist < 20) b.remove();
                })
            );
        };
    }

    // Attach to all existing blackholes
    Groups.unit.each(cons(u => { if(u.type === blackholeType) attach(u); }));

    // Attach to newly spawned blackholes
    Events.on(UnitCreateEvent, cons(e => { if(e.unit.type === blackholeType) attach(e.unit); }));

    print("BLACKHOLE SCRIPT READY");
}

// --- Run setup ---
// Immediately if world already exists, else wait for load
if(Vars.world != null){
    setupBlackholeGravity();
} else {
    Events.on(WorldLoadEvent, cons(() => setupBlackholeGravity()));
}