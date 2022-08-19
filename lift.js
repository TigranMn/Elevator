const container = document.querySelector('.liftContainer')
const leftDoor = document.querySelector('#leftDoor')
const rightDoor = document.querySelector('#rightDoor')
const lift = document.querySelector('#lift')
const floorsContainer = document.querySelector('#floors')
const children = [...floorsContainer.children]
const buildingHeight = container.clientHeight
const floorHeight = lift.clientHeight
const floors = Math.floor(buildingHeight / floorHeight)
const floorsQueue = []
let liftPosition = +lift.style.bottom.substr(0,lift.style.bottom.length -2 )
let dY = 0

floorsContainer.addEventListener('click',(event) => {
   if(!floorsQueue.length) {
   window.requestAnimationFrame(main)
   }
   if(event.target.className === 'floor') {
   event.target.classList.add('inQueue')
   floorsQueue.push(+event.target.innerText)
   }
})

async function main() {
   let currentFloor = Math.max(liftPosition / 75) + 1
   let myReq =  requestAnimationFrame(main)
   let nextFloor = findNextFloor(dY,currentFloor)
   if(!floorsQueue.length || !nextFloor) {
      cancelAnimationFrame(myReq)
      return
   }
   if((nextFloor-1) * floorHeight > liftPosition) {
      dY = +2.5

   
   } else if((nextFloor - 1) * floorHeight < liftPosition)  {
      dY = -2.5
   } 
   liftPosition = liftPosition + dY
   lift.style.bottom = liftPosition + dY + 'px'
   if((nextFloor - 1) * floorHeight === liftPosition) {
      cancelAnimationFrame(myReq)
      await sleep(1000)
      await openDoors()
      floorsQueue.splice(floorsQueue.indexOf(nextFloor),1)
      // children.find(el => el.innerText === nextFloor).classList.remove('red')
      children.find(el => el.innerText === String(nextFloor)).classList.remove('inQueue')
      requestAnimationFrame(main)
   }

}

function sleep(ms) {
   return new Promise(res => {
      setTimeout(res,ms)
   })
}

async function openDoors() {
   leftDoor.classList.add('leftDoorOpen')
   rightDoor.classList.add('rightDoorOpen')
   await sleep(5000)
   leftDoor.classList.remove('leftDoorOpen')
   rightDoor.classList.remove('rightDoorOpen')
}

function findNextFloor(moveDirection,currentFloor) {

   if(moveDirection < 0 && floorsQueue.filter(el => el < currentFloor  ).length) {
      return Math.max(...floorsQueue.filter(el => el < currentFloor))
   }
   if(floorsQueue.length) {
      return Math.max(...floorsQueue)
   }
   return currentFloor
   
}