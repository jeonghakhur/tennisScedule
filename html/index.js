
const members = [
  {name: '성재', time: [], count: []},
  {name: '영원', time: [], count: []},
  {name: '정선', time: [], count: []},
  {name: '양연', time: [], count: []},
  {name: '지훈', time: [], count: []},
  {name: '전원', time: [], count: []},
  {name: '한순', time: [], count: []},
  {name: '영민', time: [], count: []},
  {name: '정학', time: [], count: []},
  {name: '웅비', time: [], count: []},
  {name: '성훈', time: [], count: []},
  {name: '현수', time: [], count: []},
  {name: '윤슬', time: [], count: []},
  {name: '현우', time: [], count: []},
]


const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    callback()
  }
}

const setTime = time => {
  return new Date(...time).getTime()
}

const startTime = []
const endTime =[]
const courtNumber = ['a', 'b']
startTime.push(new Date(2021, 8, 16, 19, 0))
endTime.push(new Date(2021, 8, 16, 23, 0))
startTime.push(new Date(2021, 8, 16, 19, 0))
endTime.push(new Date(2021, 8, 16, 23, 0))
const moveTime = 30 * 60 * 1000

const games = () => {
  const tempArray = []
  const firstTime = Math.min(...startTime)
  let gameNumbers = []

  for (let i = 0; i < startTime.length; i += 1) {
    gameNumbers.push((endTime[i] - startTime[i]) / moveTime)
  } 

  gameNumbers.forEach((number, idx) => {
    for (let i = 0, len = number; i < len; i += 1) {
      const st = startTime[idx].getTime() + moveTime * i
      const et = st + moveTime
      tempArray.push({
        court: courtNumber[idx],
        startTime: st,
        endTime: et,
        timeOrder: (st - firstTime) / moveTime,
        player: [],
        score: [],
        type: 'D'
      })
    }
  })

  tempArray.sort((a, b) => {
    if (a.startTime < b.startTime) {
      return -1
    }
    if (a.startTime > b.startTime) {
      return 1
    }
    return 0
  })

  tempArray.forEach((game, idx) => {
    Object.assign(game, {id: idx})
  })

  return tempArray
}

// 임시 시간 
members.forEach(member => {
  member.time.push(setTime([2021, 8, 16, 19, 0]), setTime([2021, 8, 16, 23, 0]))
})

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
  return number < 10 ? '0' + number : number
}

onDOMContentLoaded(() => {
  console.clear()
  const startDate = document.querySelector('#startDate');
  const nowDate = new Date();
  const startDateValue = `${nowDate.getFullYear()}-${setNumberLength(nowDate.getMonth() + 1)}-${setNumberLength(nowDate.getDate())}`;
  startDate.value = startDateValue

  const btnTime = document.querySelector('#btnTime')
  const courTimeList = document.querySelector('.court-time-list')
  const btnCourt = document.querySelector('#btnCourt')

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
    
    console.log('createScedule')
  }

  btnTime.addEventListener('click', cloneTimeEl)

  btnCourt.addEventListener('click', createScedule)

  createScedule()
})