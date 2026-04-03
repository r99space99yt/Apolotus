print("SHIELDBLOCK HP UI SCRIPT STARTED");

const shieldBlock = Vars.content.getByName(ContentType.block, "apolotus-ShieldBlock");
if(!shieldBlock){
    print("❌ ShieldBlock not found");
}

// Track suit HP per block
let suitHPMap = {};

// Blackhole damage loop
function blackholeDamageLoop(){
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        Time.runTask(1, blackholeDamageLoop);
        return;
    }

    Time.runTask(0, function loop(){
        Groups.unit.each(cons(u => {
            if(u.type !== blackholeType) return;

            let radius = 300;
            let damagePerTick = 0.633; // 25 sec to destroy 950 hp

            Groups.build.each(cons(b => {
                if(!b || !b.block) return;
                if(b.block != shieldBlock) return;

                let dx = u.x - b.x;
                let dy = u.y - b.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist > radius) return;

                let dmg = damagePerTick * (1 - dist / radius);
                let key = b.id;
                if(!suitHPMap[key]) suitHPMap[key] = b.health;

                suitHPMap[key] -= dmg;
                b.health = Math.max(suitHPMap[key], 0);

                if(b.health <= 0){
                    b.remove();
                    delete suitHPMap[key];
                }
            }));
        }));

        Time.runTask(0, loop);
    });
}

// Player UI
Events.on(ClientLoadEvent, cons(() => {
    Core.app.post(() => {
        Events.on(RenderEvent, cons(() => {
            Groups.player.each(cons(p => {
                if(!p.stack) return;
                let stack = p.stack;

                if(stack.hasItem(shieldBlock)){
                    let b = stack.find(b => b.item == shieldBlock);
                    let hp = suitHPMap[b.id] || shieldBlock.health;
                    let pct = Math.max(0, hp / shieldBlock.health);

                    let x = p.x / Vars.tilesize;
                    let y = p.y / Vars.tilesize + 16;

                    Draw.color(Color.cyan);
                    Fill.rect(x - 8, y, 16 * pct, 2);
                    Draw.reset();
                }
            }));
        }));
    });
}));

if(Vars.world != null){
    blackholeDamageLoop();
} else {
    Events.on(WorldLoadEvent, cons(() => blackholeDamageLoop()));
}

print("SHIELDBLOCK HP UI SCRIPT READY");