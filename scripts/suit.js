print("SUIT SCRIPT LOADED");

function initSuitScript(){
    print("SUIT SCRIPT STARTED");

    const shieldName = "apolotus-ShieldBlock";
    const maxHealth = 950;
    const ticksToDestroy = 25 * 60; // 25 seconds at 60 ticks/sec
    const damagePerTick = maxHealth / ticksToDestroy;

    // Suit damage loop
    Time.runTask(0, function suitLoop(){
        Groups.unit.each(cons(u => {
            if(!u.carry?.item || u.carry.item.name !== shieldName) return;

            let block = u.carry.item;
            block.health = block.health || maxHealth;

            let nearBlackhole = false;

            Groups.unit.intersect(
                u.x - 300, u.y - 300,
                600, 600,
                cons(bh => {
                    if(bh.type && bh.type.name === "apolotus-miniBlackhole") nearBlackhole = true;
                })
            );

            if(nearBlackhole){
                block.health -= damagePerTick;
                if(block.health <= 0){
                    block.health = 0;
                    u.carry = null; // destroy suit
                }
            }

            // Store health on player for render
            u._shieldHP = block.health;
        }));

        Time.runTask(0, suitLoop);
    });

    // Draw HP bars under players
    Events.on(RenderEvent, cons(e => {
        Groups.player.each(cons(p => {
            if(p._shieldHP && p._shieldHP > 0){
                const width = 40;
                const height = 5;
                const x = p.x - width/2;
                const y = p.y - 40; // offset above feet

                const ratio = p._shieldHP / maxHealth;

                Draw.color(Color.gray);
                Fill.rect(x, y, width, height); // background

                Draw.color(Color.cyan);
                Fill.rect(x, y, width * ratio, height); // current HP

                Draw.color(); // reset color
            }
        }));
    }));

    print("SUIT SCRIPT READY WITH UI");
}

initSuitScript();