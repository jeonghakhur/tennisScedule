console.clear()
const dataGame = JSON.parse(localStorage.getItem('dataGame'))
const members = [
  {name: '한양연', time: ['19:00', '23:00'], count: []},
  {name: '허정학', time: ['20:00', '23:00'], count: []},
  {name: '장영원', time: ['19:00', '23:00'], count: []},
  {name: '고건한', time: ['19:00', '23:00'], count: []},
  {name: '최다현', time: ['20:00', '23:00'], count: []},
  {name: '고수현', time: ['19:00', '23:00'], count: []},
  {name: '한웅비', time: ['19:00', '22:00'], count: []},
  {name: '전원', time: ['19:00', '22:00'], count: []},
  {name: '장지훈', time: ['19:00', '23:00'], count: []},
  {name: '이현우', time: ['20:00', '23:00'], count: []},
]

const setTime = (time) => {
  return new Date(... time)
}

members.forEach(member => {
  const st = member.time[0].split(':')
  const et = member.time[1].split(':')
  member.time[0] = setTime([2021, 8, 27, st[0], st[1]])
  member.time[1] = setTime([2021, 8, 27, et[0], et[1]])
})


const memberItemTemplate = `
  <div class="member-item">
  <input type="text" size="10" placeholder="참석자 이름" name="memberName">
  <input type="time" value="19:00" name="memberStartTime">
  <input type="time" value="23:00" name="memberEndTime">
  <button type="button">Delete</button>
  </div>
`
class Game {
  constructor() {
    this.memberCount = 0
  }

  init() {
    // dataGame.push
    this.startTime = []
    this.endTime = []
    this.courtNumber = []
    this.moveTime = 0

    members.forEach(member => {
      member.count = []
    })

    const today = document.querySelector('#startDate').value
    const startTimeEls = document.querySelectorAll('[name="startTime"]')
    const endTimeEls = document.querySelectorAll('[name="endTime"]')
    const courtNumberEls = document.querySelectorAll('[name="courtNumber"]')

    courtNumberEls.forEach(courtNumber => {
      const value = courtNumber.value
      if (!value) {
        alert('코드 번호를 입력해 주세요')
        return
      }

      this.courtNumber.forEach(val => {
        if (val === value) {
          alert('동일한 코드가 입력되었습니다. 다시 확인 바랍니다.')
          courtNumber.focus()
        }
      })

      this.courtNumber.push(value)
    })

    startTimeEls.forEach(startTime => {
      const time = startTime.value.split(':')
      const date = new Date(today)
      date.setHours(time[0])
      date.setMinutes(time[1])
      this.startTime.push(date)
    })

    endTimeEls.forEach(endTime => {
      const time = endTime.value.split(':')
      const date = new Date(today)
      date.setHours(time[0])
      date.setMinutes(time[1])
      this.endTime.push(date)
    })

    this.moveTime = document.querySelector('[name="moveTime"]').value * 60 * 1000

    this.setCourt()
  }

  setCourt() {
    const { startTime, endTime, moveTime, courtNumber} = this
    this.games = []
    const firstTime = Math.min(... startTime)
    this.gameNumbers = []

    for (let i = 0; i < startTime.length; i += 1) {
      this.gameNumbers.push((endTime[i] - startTime[i]) / moveTime)
    }

    this.gameNumbers.forEach((number, idx) => {
      for (let i = 0, len = number; i < len; i += 1) {
        const st = startTime[idx].getTime() + moveTime * i
        const et = st + moveTime
        this.games.push({
          court: courtNumber[idx],
          startTime: st,
          endTime: et,
          timeOrder: (st- firstTime) / moveTime,
          player: [],
          score: [],
          type: 'D'
        })
      }
    })
    
    this.games.sort((a, b) => {
      if (a.startTime < b.startTime) {
        return -1
      }
      if (a.startTime > b.startTime) {
        return 1
      }
      return 0
    })
  
    this.games.forEach((game, idx) => {
      Object.assign(game, {id: idx})
    })

    this.createGames()
  }

  createGames(type = 'D') {
    let tempMembers = []
    this.games.forEach(game => {
      const { startTime, endTime, timeOrder } = game
      const len = type === 'D' ? 4 : 2
  
      tempMembers = members.filter(member => {
        const mst = member.time[0]
        const met = member.time[1]
        const count = member.count
        if (mst <= startTime && met >= endTime && count.indexOf(timeOrder) === -1) return member
      })
  
      tempMembers.sort(() => Math.random() - Math.random())
      tempMembers.sort((a, b) => {
        const o1 = a.count.length
        const o2 = b.count.length
  
        if (o1 < o2) {
          return -1
        }
        if (o1 > o2) {
          return 1
        }
        return 0
      })
  
  
      if (tempMembers.length < 4) return
      
      for (let i = 0; i < len; i += 1) {
        const member = tempMembers[i]
        member.count.push(timeOrder)
        game.player.push(member.name)
      }
    })

    this.games.forEach(game => {

    })

    console.log(this.games)
  }

  addMember() {
    this.memberCount += 1
    const memberList = document.querySelector('.member-list')
    const tempEl = document.createElement('div')
    tempEl.innerHTML = memberItemTemplate
    const child = tempEl.children[0]
    const btnDelete = child.querySelector('button')
    btnDelete.addEventListener('click', e => {
      const parent = e.target.parentNode
      parent.remove()
    })
    child.classList.add(`member-item-count-${this.memberCount}`)
    memberList.appendChild(tempEl.children[0])
  }
}

const game = new Game()


const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    callback()
  }
}

const setGame = (type = 'D') => {
  let tempMembers = []
  games.forEach(game => {
    const { startTime, endTime, timeOrder } = game
    const len = type === 'D' ? 4 : 2

    tempMembers = members.filter(member => {
      const mst = member.time[0]
      const met = member.time[1]
      const count = member.count
      if (mst <= startTime && met >= endTime && count.indexOf(timeOrder) === -1) return member
    })

    tempMembers.sort(() => Math.random() - Math.random())
    tempMembers.sort((a, b) => {
      const o1 = a.count.length
      const o2 = b.count.length

      if (o1 < o2) {
        return -1
      }
      if (o1 > o2) {
        return 1
      }
      return 0
    })


    if (tempMembers.length < 4) return
    
    for (let i = 0; i < len; i += 1) {
      const member = tempMembers[i]
      member.count.push(timeOrder)
      game.player.push(member.name)
    }
  })
}

function setNumberLength(number) {
  return number < 10? '0' + number : number
}

onDOMContentLoaded(() => {
  
  const startDate = document.querySelector('#startDate');
  const nowDate = new Date();
  const startDateValue = `${nowDate.getFullYear()}-${setNumberLength(nowDate.getMonth() + 1)}-${setNumberLength(nowDate.getDate())}`;
  startDate.value = startDateValue

  const btnTime = document.querySelector('#btnTime')
  const courTimeList = document.querySelector('.court-time-list')
  const btnCourt = document.querySelector('#btnCourt')
  const btnMemberAdd = document.querySelector('#btnMemberAdd')

  let cloneLen = 0
  const cloneTimeEl = e => {
    const cloneEl = courTimeList.cloneNode(true)
    const parentNode = courTimeList.parentNode
    const btnDelete = document.createElement('button')
    btnDelete.textContent = 'Delete'
    btnDelete.type = 'button'

    btnDelete.addEventListener('click', handleRemoveCourt)
    cloneEl.append(btnDelete)
    cloneLen += 1
    cloneEl.classList.add(`clone-${cloneLen}`) 
    parentNode.append(cloneEl)
  }

  const handleRemoveCourt = e => {
    e.target.parentNode.remove()
    console.log('remove court')
  }

  const createScedule = () => {
    game.init()
  }

  btnTime.addEventListener('click', cloneTimeEl)
  btnMemberAdd.addEventListener('click', () => {
    game.addMember()
  })

  btnCourt.addEventListener('click', createScedule)

  createScedule()
})