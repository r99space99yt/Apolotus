print("SUIT SCRIPT LOADED");

const shieldName = "apolotus-ShieldBlock";
const maxShieldHP = 950;

// Map unit ID -> current shield HP
let shieldHPMap = {};

function initSuitUI(){
    // --- Render UI ---
    Events.on(RenderEvent, cons(() => {
        Groups.unit.each(cons(u => {
            if(!u.carry || !u.carry.item || u.carry.item.name !== shieldName) return;

            let hp = shieldHPMap[u.id];
            if(hp == null) hp = maxShieldHP;

            Draw.z(Layer.overlay + 1);
            Draw.color(Color.red);
            Draw.text(Math.floor(hp) + " HP", u.x, u.y - u.hitSize - 10);
        }));
    }));

    // --- Damage shield if near blackhole ---
    Time.runTask(0, function shieldLoop(){
        Groups.unit.each(cons(u => {
            if(!u.carry || !u.carry.item || u.carry.item.name !== shieldName) return;

            let hp = shieldHPMap[u.id];
            if(hp == null) hp = maxShieldHP;

            let nearBH = false;
            Groups.unit.intersect(
                u.x - 300, u.y - 300, 600, 600,
                cons(unit => {
                    if(unit.type && unit.type.name === "apolotus-miniBlackhole") nearBH = true;
                })
            );

            if(nearBH){
                hp -= maxShieldHP / (25 * 60); // 25 sec to destroy at 60 ticks/sec
                if(hp <= 0){
                    hp = 0;
                    u.carry = null; // drop shield
                }
            }

            shieldHPMap[u.id] = hp;
        }));

        Time.runTask(0, shieldLoop);
    });

    print("SUIT SCRIPT READY");
}

// Initialize
initSuitUI();