const GameEvents = {
    eventList: [
        {
            id: 1,
            name: "โชคดี!",
            description: "คุณพบเหรียญทอง! เดินหน้าอีก 3 ช่อง",
            effect: 3,
            emoji: "💰"
        },
        {
            id: 2,
            name: "โชคร้าย!",
            description: "เหยียบกับดัก! ถอยหลัง 2 ช่อง",
            effect: -2,
            emoji: "🕳️"
        },
        {
            id: 3,
            name: "พายุ!",
            description: "พายุพัดคุณถอยหลัง 4 ช่อง",
            effect: -4,
            emoji: "🌪️"
        },
        {
            id: 4,
            name: "ขี่ม้า!",
            description: "คุณขี่ม้าวิ่งไปอีก 5 ช่อง!",
            effect: 5,
            emoji: "🐴"
        },
        {
            id: 5,
            name: "พักผ่อน",
            description: "คุณหยุดพักผ่อน พลาดเทิร์นถัดไป",
            effect: 0,
            skipNextTurn: true,
            emoji: "😴"
        },
        {
            id: 6,
            name: "โชคดีมาก!",
            description: "คุณพบทางลัด! กระโดดไปอีก 7 ช่อง!",
            effect: 7,
            emoji: "✨"
        },
        {
            id: 7,
            name: "ลื่นล้ม!",
            description: "คุณลื่นล้ม! ถอยกลับไป 3 ช่อง",
            effect: -3,
            emoji: "🤕"
        },
        {
            id: 8,
            name: "ได้ของขวัญ",
            description: "ได้รับของขวัญ! คุณพอใจมากเดินหน้าอีก 4 ช่อง",
            effect: 4,
            emoji: "🎁"
        }
    ],

    getRandomEvent() {
        const randomIndex = Math.floor(Math.random() * this.eventList.length);
        return this.eventList[randomIndex];
    },

    hasEventAtPosition(position, eventCells) {
        return eventCells.includes(position);
    },

    applyEventEffect(player, event, maxPosition) {
        let newPosition = player.position + event.effect;
        
        if (newPosition < 0) {
            newPosition = 0;
        }
        
        if (newPosition > maxPosition) {
            newPosition = maxPosition;
        }
        
        return {
            newPosition: newPosition,
            skipNextTurn: event.skipNextTurn || false
        };
    },

    getEventLogMessage(player, event) {
        return `${event.emoji} ${player.name}: ${event.name} - ${event.description}`;
    }
};
