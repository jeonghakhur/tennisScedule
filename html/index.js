console.clear();

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

const memberItemTemplate = `
  <tr>
    <td></td>
    <td><input type="text" size="10" placeholder="참석자 이름" name="memberName"></td>
    <td><label><input type="radio" value="M" />남성</label><label><input type="radio" value="F" />여성</label></td>
    <td></td>
    <td></td>
    <td></td>
    <td><button type="button">삭제</button></td>
  </tr>
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
    this.dataGame = JSON.parse(localStorage.getItem('dataGame'));
    this.memberId = 0;
    this.gameList = document.querySelector('#gameList')
    this.memberList = document.querySelector('#memberList')
    this.courtStartTime = []
    this.courtEndTime = []
  }

  init() {
    this.today = document.querySelector('#startDate').value;
    this.dataGame.forEach((data) => {
      if (data.idx === 1) {
        this.data = data;
      }
    });

    if (this.data.members) {
      this.data.members.forEach((member) => {
        this.addMember(member);
      });
    }

    this.courtStartTime = this.setCourtTime(document.querySelectorAll('[name="courtStartHour"]'))
    this.courtEndTime = this.setCourtTime(document.querySelectorAll('[name="courtEndHour"]'))

    this.setEventLintener();
  }

  setCourtTime(els) {
    const array = []
    els.forEach(el => {
      const date = new Date(this.today)
      date.setHours(el.value)
      array.push(date)
    })
    return array
  }

  setEventLintener() {
    const btnMemberAdd = document.querySelector('#btnMemberAdd');
    const btnMemberSave = document.querySelector('#btnMemberSave');
    const btnCourt = document.querySelector('#btnCourt')
    const courtStartHourEls = document.querySelectorAll('[name="courtStartHour"]')
    const courtEndHourEls = document.querySelectorAll('[name="courtEndHour"]')

    btnMemberAdd.addEventListener('click', () => {
      this.addMember();
    });

    btnMemberSave.addEventListener('click', () => {
      this.saveMember();
    });

    btnCourt.addEventListener('click', () => {
      this.setCourt()
    })

    courtStartHourEls.forEach(el => {
      el.addEventListener('change', this.handleCourtStartTime.bind(this))
    })

    courtEndHourEls.forEach(el => {
      el.addEventListener('change', this.handleCourtEndTime.bind(this))
    })

    this.setCourt()
  }

  handleCourtStartTime(e) {
    const courtStartHourEls = document.querySelectorAll('[name="courtStartHour"]')
    courtStartHourEls.forEach((el, idx) => {
      if (el === e.target) {
        this.courtStartTime[idx].setHours(e.target.value)
      }
    })
  }

  handleCourtEndTime(e) {
    const courtEndHourEls = document.querySelectorAll('[name="courtEndHour"]')
    courtEndHourEls.forEach((el, idx) => {
      if (el === e.target) {
        this.courtEndTime[idx].setHours(e.target.value)
      }
    })
    console.log(this.courtEndTime)
  }

  setCourt() {
    this.games = []
    if (!this.data.mebers) return

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
    const tempEl = document.createElement('template');
    tempEl.innerHTML = memberItemTemplate;
    const row = tempEl.content.firstElementChild;
    const cells = row.querySelectorAll('td')
    const name = row.querySelector('[name="memberName"]')
    const radios = row.querySelectorAll('input[type="radio"]')
    const btnDelete = row.querySelector('button')
    const firstTime = Math.min(...this.courtStartTime)
    const lastTime = Math.max(...this.courtEndTime)
    cells[0].textContent = this.memberId

    radios.forEach((radio, idx) => {
      radio.setAttribute('name', `gender-${this.memberId}`)
      if (idx === 0) radio.checked = true
    })

    const addOption = (select, len, val) => {
      for (let i = 0; i < len; i += val) {
        const option = document.createElement('option')
        option.value = i
        option.textContent = String(i).length < 2 ? '0' + i : i
        select.appendChild(option)
      }
    }

    for (let i = 0, len = 4; i < len; i += 1) {
      const select = document.createElement('select')
      if (i % 2) {
        addOption(select, 60, 30)
      } else {
        addOption(select, 24, 1)
      }
      if (i === 2) {
        cells[3].append('~')
      }
      cells[3].appendChild(select)
    }

    const timeEls = row.querySelectorAll('select')
    timeEls[0].value = new Date(firstTime).getHours()
    timeEls[2].value = new Date(lastTime).getHours()

    if (member) {
      name.value = member.name;
      timeEls[0].value = new Date(member.startTime).getHours();
      timeEls[1].value = new Date(member.startTime).getMinutes();
      timeEls[2].value = new Date(member.endTime).getHours();
      timeEls[3].value = new Date(member.endTime).getMinutes();
    } 

    btnDelete.addEventListener('click', (e) => {
      const parent = e.target.closest('tr');
      const memberItems = memberList.childNodes;
      const index = [].findIndex.call(memberItems, (item) => {
        return item === parent;
      });
      this.data.members.splice(index, 1);
      parent.remove();
    });

    this.memberList.appendChild(row);
    name.focus();
  }

  saveMember() {
    this.members = [];
    const rows = this.memberList.querySelectorAll('tr')
    rows.forEach(row => {
      const nameEl = row.querySelector('[name="memberName"]')
      const timeEls = row.querySelectorAll('select')
      const startHour = timeEls[0].value
      const startMinute = timeEls[1].value
      const endHour = timeEls[2].value
      const endMinute = timeEls[3].value
      const startTime = new Date(this.today)
      const endTime = new Date(this.today)
      startTime.setHours(startHour)
      startTime.setMinutes(startMinute)
      endTime.setHours(endHour)
      endTime.setMinutes(endMinute)

      this.members.push({
        name: nameEl.value,
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

    // localStorage.setItem('dataGame', JSON.stringify(this.dataGame));
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
