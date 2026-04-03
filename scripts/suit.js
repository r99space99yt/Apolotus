print("SUIT SCRIPT LOADED");

function initSuitScript(){
    print("SUIT SCRIPT STARTED");

    var shieldName = "apolotus-ShieldBlock";
    var maxHealth = 950;
    var ticksToDestroy = 25 * 60; // 25 sec at 60 ticks/sec
    var damagePerTick = maxHealth / ticksToDestroy;

    // Suit damage loop
    Time.runTask(0, function suitLoop(){
        Groups.unit.each(cons(function(u){
            if(!u.carry || !u.carry.item) return;
            if(u.carry.item.name !== shieldName) return;

            var block = u.carry.item;
            if(block.health == null) block.health = maxHealth;

            var nearBlackhole = false;

            Groups.unit.intersect(
                u.x - 300, u.y - 300,
                600, 600,
                cons(function(bh){
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
    Events.on(RenderEvent, cons(function(e){
        Groups.player.each(cons(function(p){
            if(p._shieldHP && p._shieldHP > 0){
                var width = 40;
                var height = 5;
                var x = p.x - width/2;
                var y = p.y - 40; // offset above feet

                var ratio = p._shieldHP / maxHealth;

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