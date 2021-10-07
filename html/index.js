console.clear();
const members = [
  { name: '한양연', time: ['19:00', '23:00'], count: [] },
  { name: '허정학', time: ['20:00', '23:00'], count: [] },
  { name: '장영원', time: ['19:00', '23:00'], count: [] },
  { name: '고건한', time: ['19:00', '23:00'], count: [] },
  { name: '최다현', time: ['20:00', '23:00'], count: [] },
  { name: '고수현', time: ['19:00', '23:00'], count: [] },
  { name: '한웅비', time: ['19:00', '22:00'], count: [] },
  { name: '전원', time: ['19:00', '22:00'], count: [] },
  { name: '장지훈', time: ['19:00', '23:00'], count: [] },
  { name: '이현우', time: ['20:00', '23:00'], count: [] },
];

const setTime = (time) => {
  return new Date(...time);
};

const numberLength = (number, length) => {
  const val = String(number)
  if (val.length < length) {
    let str = ''
    for (let i = 0; i < length - 1; i += 1) {
      str += '0'
    }
    return str + String(number) 
  }
  return number
}

members.forEach((member) => {
  const st = member.time[0].split(':');
  const et = member.time[1].split(':');
  member.time[0] = setTime([2021, 8, 27, st[0], st[1]]);
  member.time[1] = setTime([2021, 8, 27, et[0], et[1]]);
});

const memberItemTemplate = `
  <div class="member-item">
  <input type="text" size="10" placeholder="참석자 이름" name="memberName">
  <label>시작시간</label>
  <select name="memberStartHour">
    <option value="1">01</option>
    <option value="2">02</option>
    <option value="3">03</option>
    <option value="4">04</option>
    <option value="5">06</option>
    <option value="6">06</option>
    <option value="7">07</option>
    <option value="8">08</option>
    <option value="9">09</option>
    <option value="10">10</option>
    <option value="11">11</option>
    <option value="12">12</option>
    <option value="13">13</option>
    <option value="14">14</option>
    <option value="15">15</option>
    <option value="16">16</option>
    <option value="17">17</option>
    <option value="18">18</option>
    <option value="19" selected>19</option>
    <option value="20">20</option>
    <option value="21">21</option>
    <option value="22">22</option>
    <option value="23">23</option>
    <option value="00">24</option>
  </select>
  <select name="memberStartMinute">
    <option value="0" selected>00</option>
    <option value="30">30</option>
  </select>
  <label>종료시간</label>
  <select name="memberEndHour">
    <option value="1">01</option>
    <option value="2">02</option>
    <option value="3">03</option>
    <option value="4">04</option>
    <option value="5">06</option>
    <option value="6">06</option>
    <option value="7">07</option>
    <option value="8">08</option>
    <option value="9">09</option>
    <option value="10">10</option>
    <option value="11">11</option>
    <option value="12">12</option>
    <option value="13">13</option>
    <option value="14">14</option>
    <option value="15">15</option>
    <option value="16">16</option>
    <option value="17">17</option>
    <option value="18">18</option>
    <option value="19">19</option>
    <option value="20">20</option>
    <option value="21">21</option>
    <option value="22">22</option>
    <option value="23" selected>23</option>
    <option value="00">24</option>
  </select>
  <select name="memberEndMinute">
    <option value="0" selected>00</option>
    <option value="30">30</option>
  </select>
  <button type="button">Delete</button>
  </div>
`;

const gameTemplate = `
  <tr>
    <td class="number"></td>
    <td class="court"></td>
    <td class="time"></td>
    <td class="pair-a"></td>
    <td class="pair-b"></td>
    <td class="score">
      <input type="text" size="2">
      <input type="text" size="2">
    </td>
    <td><button type="button">저장</button></td>
  </tr>
`
class Game {
  constructor() {
    this.today = document.querySelector('#startDate').value;
    this.dataGame = JSON.parse(localStorage.getItem('dataGame'));
    this.memberId = 0;
    this.gameWrap = document.querySelector('#gameWrap')
    this.gameList = document.querySelector('#gameList')
  }

  init() {
    this.dataGame.forEach((data) => {
      if (data.idx === 1) {
        this.data = data;
      }
    });

    this.data.members.forEach((member) => {
      this.addMember(member);
    });


    this.setEventLintener();
  }

  setEventLintener() {
    const btnMemberAdd = document.querySelector('#btnMemberAdd');
    const btnMemberSave = document.querySelector('#btnMemberSave');
    const btnCourt = document.querySelector('#btnCourt')

    btnMemberAdd.addEventListener('click', () => {
      this.addMember();
    });

    btnMemberSave.addEventListener('click', () => {
      this.saveMember();
    });

    btnCourt.addEventListener('click', () => {
      this.setCourt()
    })

    this.setCourt()
  }

  setCourt() {
    this.games = []
    this.data.members.forEach(member => {
      member.count = []
    })
    const startTime = [];
    const endTime = [];
    const courtNumber = [];
    let moveTime = 0;
    const gameNumbers = [];

    const startTimeEls = document.querySelectorAll('[name="startTime"]');
    const endTimeEls = document.querySelectorAll('[name="endTime"]');
    const courtNumberEls = document.querySelectorAll('[name="courtNumber"]');

    courtNumberEls.forEach((el) => {
      const value = el.value;
      if (!value) {
        alert('코트 번호를 입력해 주세요');
        return;
      }

      courtNumber.forEach((val) => {
        if (val === value) {
          alert('동일한 코드가 입력되었습니다. 다시 확인 바랍니다.');
          el.focus();
          return;
        }
      });

      courtNumber.push(value);
    });

    startTimeEls.forEach((el) => {
      const time = el.value.split(':');
      const date = new Date(this.today);
      date.setHours(time[0]);
      date.setMinutes(time[1]);
      startTime.push(date);
    });

    endTimeEls.forEach((el) => {
      const time = el.value.split(':');
      const date = new Date(this.today);
      date.setHours(time[0]);
      date.setMinutes(time[1]);
      endTime.push(date);
    });

    moveTime =
      document.querySelector('[name="moveTime"]').value * 60 * 1000;

    const firstTime = Math.min(...startTime);
    

    for (let i = 0; i < startTime.length; i += 1) {
      gameNumbers.push((endTime[i] - startTime[i]) / moveTime);
    }

    gameNumbers.forEach((number, idx) => {
      for (let i = 0, len = number; i < len; i += 1) {
        const st = startTime[idx].getTime() + moveTime * i;
        const et = st + moveTime;
        this.games.push({
          court: courtNumber[idx],
          startTime: st,
          endTime: et,
          timeOrder: (st - firstTime) / moveTime,
          player: [],
          score: [],
          type: 'D',
        });
      }
    });

    this.games.sort((a, b) => {
      if (a.startTime < b.startTime) {
        return -1;
      }
      if (a.startTime > b.startTime) {
        return 1;
      }
      return 0;
    });

    this.gameList.innerHTML = ''
    this.games.forEach((game, idx) => {
      Object.assign(game, { id: idx });
      this.setGameElements(game, idx)
    });

    console.log(this.data.members)
  }

  setGameElements(game, idx) {
    const {court, timeOrder} = game
    const startTime = new Date(game.startTime)
    const startHour = numberLength(startTime.getHours(), 2)
    const startMinute = numberLength(startTime.getMinutes(), 2)
    const endTime = new Date(game.endTime)
    const endHour = numberLength(endTime.getHours(), 2)
    const endMinute = numberLength(endTime.getMinutes(), 2)
    const tempEl = document.createElement('template')
    tempEl.innerHTML = gameTemplate
    const row = tempEl.content.firstElementChild
    const cell = row.querySelectorAll('td')
    
    cell[0].textContent = idx + 1
    cell[1].textContent = court
    cell[2].innerHTML = `${startHour}:${startMinute}<br>${endHour}:${endMinute}`

    // 참석 가능한 모든 멤버
    const tempMembers = this.data.members.filter(member => {
      const mst = member.startTime
      const met = member.endTime
      if (mst <= startTime.getTime() && met >= endTime.getTime()) return member
    })
    // 현재 타임에 참석한 멤버 제외
    tempMembers.sort(() => Math.random() - Math.random())
    tempMembers.sort((a, b) => {
      if (a.count.length < b.count.length) {
        return -1
      }
      if (a.count.length > b.count.length) {
        return 1
      }
      return 0
    })

    for (let i = 0, len = 4; i < len; i += 1) {
      const useMembers = tempMembers.filter(member => {
        if (member.count.indexOf(timeOrder) === -1) return member
      })

      const select = document.createElement('select')
      useMembers.forEach((member, idx) => {
        const option = document.createElement('option')
        option.value = member.name
        option.textContent = member.name
        select.append(option)
        if (idx === 0) {
          this.data.members.find(m => {
            if (m.name === member.name) {
              m.count.push(game.timeOrder)
            }
          })
        }
      })

      if (i < 2) {
        cell[3].append(select)
      } else {
        cell[4].append(select)
      }
    }

    this.gameList.appendChild(tempEl.content.firstElementChild)
  }

  createGames(type = 'D') {
    let tempMembers = [];
    this.games.forEach((game) => {
      const { startTime, endTime, timeOrder } = game;
      const len = type === 'D' ? 4 : 2;

      tempMembers = members.filter((member) => {
        const mst = member.startTime;
        const met = member.endTime;
        const count = member.count;
        if (
          mst <= startTime &&
          met >= endTime &&
          count.indexOf(timeOrder) === -1
        )
          return member;
      });

      tempMembers.sort(() => Math.random() - Math.random());
      tempMembers.sort((a, b) => {
        const o1 = a.count.length;
        const o2 = b.count.length;

        if (o1 < o2) {
          return -1;
        }
        if (o1 > o2) {
          return 1;
        }
        return 0;
      });

      if (tempMembers.length < 4) return;

      for (let i = 0; i < len; i += 1) {
        const member = tempMembers[i];
        member.count.push(timeOrder);
        game.player.push(member.name);
      }
    });

    this.games.forEach((game) => {});

    // console.log(this.games);
  }

  addMember(member) {
    this.memberId += 1;
    const memberList = document.querySelector('.member-list');
    const tempEl = document.createElement('div');
    tempEl.innerHTML = memberItemTemplate;
    const child = tempEl.children[0];
    const name = child.querySelector('[name="memberName"]');
    const startHour = child.querySelector('[name="memberStartHour"]');
    const startMinute = child.querySelector('[name="memberStartMinute"]');
    const endHour = child.querySelector('[name="memberEndHour"]');
    const endMinute = child.querySelector('[name="memberEndMinute"]');
    const btnDelete = child.querySelector('button');

    if (member) {
      name.value = member.name;
      startHour.value = new Date(member.startTime).getHours();
      startMinute.value = new Date(member.startTime).getMinutes();
      endHour.value = new Date(member.endTime).getHours();
      endMinute.value = new Date(member.endTime).getMinutes();
    }

    btnDelete.addEventListener('click', (e) => {
      const parent = e.target.parentNode;
      const memberItems = memberList.childNodes;
      const index = [].findIndex.call(memberItems, (item) => {
        return item === parent;
      });
      this.data.members.splice(index, 1);
      parent.remove();
    });

    child.id = `memberId-${this.memberId}`;
    memberList.appendChild(tempEl.children[0]);
    name.focus();
  }

  saveMember() {
    const memberItems = document.querySelectorAll('.member-item');
    this.members = [];

    memberItems.forEach((member) => {
      const startHour = member.querySelector('[name="memberStartHour"]').value;
      const startMinute = member.querySelector(
        '[name="memberStartMinute"]'
      ).value;
      const endHour = member.querySelector('[name="memberEndHour"]').value;
      const endMinute = member.querySelector('[name="memberEndMinute"]').value;
      const startTime = new Date(this.today);
      const endTime = new Date(this.today);
      startTime.setHours(startHour);
      startTime.setMinutes(startMinute);
      endTime.setHours(endHour);
      endTime.setMinutes(endMinute);

      this.members.push({
        name: member.querySelector('[name="memberName"]').value,
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
        count: [],
        gender: ''
      });
    });

    this.dataGame.forEach((data) => {
      if (data.idx === 1) {
        data.members = this.members;
      }
    });

    localStorage.setItem('dataGame', JSON.stringify(this.dataGame));
  }
}

const game = new Game();

const onDOMContentLoaded = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

function setNumberLength(number) {
  return number < 10 ? '0' + number : number;
}

onDOMContentLoaded(() => {
  const startDate = document.querySelector('#startDate');
  const nowDate = new Date();
  const startDateValue = `${nowDate.getFullYear()}-${setNumberLength(
    nowDate.getMonth() + 1
  )}-${setNumberLength(nowDate.getDate())}`;
  startDate.value = startDateValue;

  const btnTime = document.querySelector('#btnTime');
  const courTimeList = document.querySelector('.court-time-list');
  const btnCourt = document.querySelector('#btnCourt');
  const btnMemberAdd = document.querySelector('#btnMemberAdd');

  let cloneLen = 0;
  const cloneTimeEl = (e) => {
    const cloneEl = courTimeList.cloneNode(true);
    const parentNode = courTimeList.parentNode;
    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.type = 'button';

    btnDelete.addEventListener('click', handleRemoveCourt);
    cloneEl.append(btnDelete);
    cloneLen += 1;
    cloneEl.classList.add(`clone-${cloneLen}`);
    parentNode.append(cloneEl);
  };

  const handleRemoveCourt = (e) => {
    e.target.parentNode.remove();
    console.log('remove court');
  };

  const createScedule = () => {
    game.init();
  };

  btnTime.addEventListener('click', cloneTimeEl);
  // btnMemberAdd.addEventListener('click', () => {
  //   game.addMember()
  // })

  // btnCourt.addEventListener('click', createScedule);

  createScedule();
});
