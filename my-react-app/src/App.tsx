import { useState, useRef, useEffect, type JSX } from "react"
import Die from "./Die.tsx"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export type Dice = {
  value: number
  isHeld: boolean
  id: string
}
export default function App() {
  const [dice, setDice] = useState<Dice[]>(() => generateAllNewDice())
  const buttonRef = useRef<HTMLButtonElement>(null) // Dont write type a variable that comes from hook

  const gameWon: boolean = dice.every(die => die.isHeld) &&
    dice.every(die => die.value === dice[0].value)

  useEffect(() => {
    if (gameWon) {
      if (buttonRef.current) {
        buttonRef.current.focus()
      } else return
    }
  }, [gameWon])

  function generateAllNewDice(): Dice[] {
    return new Array(10)
      .fill(0)
      .map(() => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      }))
  }

  function rollDice(): void {
    if (!gameWon) {
      setDice((oldDice) => oldDice.map((die) =>
        die.isHeld ?
          die :
          { ...die, value: Math.ceil(Math.random() * 6) }
      ))
    } else {
      setDice(generateAllNewDice())
    }
  }

  function hold(id: string): void {
    console.log(dice)
    setDice((oldDice) => oldDice.map((die) =>
      die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    ))
  }

  const diceElements: JSX.Element[] = dice.map((dieObj): JSX.Element => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
    />
  ))

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  )
}