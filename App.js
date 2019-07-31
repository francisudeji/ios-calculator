import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  PermissionsAndroid
} from 'react-native'

function Row({ children }) {
  return <View style={styles.row}>{children}</View>
}

export default function App() {
  const [displayValue, setDisplayValue] = useState(0)
  const [, setEqualToClicked] = useState(false)
  const [isWaitingForOperand, setWaitingForOperand] = useState(false)
  const [operator, setOperator] = useState(null)
  const [prevValue, setPrevValue] = useState(null)
  const [, setNextValue] = useState(null)

  useEffect(() => {
    async function getPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'iOS Calculator App Permission',
            message:
              'iOS Calculator wants your storage permission blah blah blah',
            buttonNeutral: 'Ask me later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
          }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Granted')
        } else {
          console.log('Not Granted')
        }
      } catch (err) {
        console.warn(err)
      }
    }

    getPermission()
  }, [])

  async function getStoragePermission() {}

  const plusMinus = () => {
    if (displayValue === '') return false

    if (displayValue.indexOf('-') === -1) {
      setDisplayValue(`-${displayValue}`)
    } else {
      setDisplayValue(displayValue.substr(1, displayValue.length))
    }
  }

  const clear = () => {
    setDisplayValue(0)
    setEqualToClicked(false)
    setWaitingForOperand(false)
    setOperator(null)
    setPrevValue(null)
    setNextValue(null)
  }

  const clearOne = () => {
    let _displayValue = String(displayValue).split('')
    _displayValue = _displayValue.slice(0, _displayValue.length - 1).join('')
    setDisplayValue(_displayValue)
  }

  const displayChange = e => {
    setDisplayValue(e.target.value)
  }

  const punch = digit => {
    if (isWaitingForOperand) {
      setPrevValue(displayValue)
      setDisplayValue(digit)

      setWaitingForOperand(false)
    } else {
      setDisplayValue(`${displayValue}${digit}`)
    }

    if (displayValue.toString().charAt(0) === '0') {
      setDisplayValue(displayValue + digit)
    }
  }

  const percent = () => {
    if (parseFloat(displayValue) !== null) {
      const percentage = displayValue / 100
      setDisplayValue(String(percentage))
    }
  }

  const dot = dot => {
    if (displayValue.toString().indexOf('.') !== -1) {
      return
    }

    setDisplayValue(`${displayValue}${dot}`)
  }

  const operation = operator => {
    setOperator(operator)
    setWaitingForOperand(true)
  }

  const compute = () => {
    let answer = null

    if (operator === null || prevValue === null) return false

    let nextValue = displayValue

    switch (operator) {
      case '*':
        answer = parseFloat(prevValue) * parseFloat(nextValue)
        break
      case '-':
        answer = parseFloat(prevValue) - parseFloat(nextValue)
        break
      case '+':
        answer = parseFloat(prevValue) + parseFloat(nextValue)
        break
      case '/':
        answer = parseFloat(prevValue) / parseFloat(nextValue)
        break
      default:
        return
    }

    setDisplayValue(String(answer))
    setEqualToClicked(true)
    setPrevValue(0)
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.display}
          onFocus={e => Keyboard.dismiss()}
          placeholder='0'
          value={String(displayValue)}
          onChange={displayChange}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Row>
          <TouchableOpacity onPress={e => clear()} style={styles.btn}>
            <Text style={styles.btnText}>AC</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={e => plusMinus()} style={styles.btn}>
            <Text style={styles.btnText}>+/-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={e => operation('/')} style={styles.btn}>
            <Text style={styles.btnText}>/</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => clearOne()}
            style={{ ...styles.btn, backgroundColor: 'orange' }}
          >
            <Text
              style={{
                ...styles.btnText,
                color: 'orange',
                fontWeight: '700',
                backgroundColor: '#fff',
                paddingHorizontal: 8,
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16
              }}
            >
              &times;
            </Text>
          </TouchableOpacity>
        </Row>
        <Row>
          <TouchableOpacity
            onPress={e => punch(7)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => punch(8)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => punch(9)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => operation('*')}
            style={{ ...styles.btn, backgroundColor: 'orange' }}
          >
            <Text
              style={{
                ...styles.btnText,
                color: '#fff',
                fontWeight: '700'
              }}
            >
              &times;
            </Text>
          </TouchableOpacity>
        </Row>
        <Row>
          <TouchableOpacity
            onPress={e => punch(4)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => punch(5)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => punch(6)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => operation('-')}
            style={{ ...styles.btn, backgroundColor: 'orange' }}
          >
            <Text
              style={{ ...styles.btnText, color: '#fff', fontWeight: '700' }}
            >
              -
            </Text>
          </TouchableOpacity>
        </Row>
        <Row>
          <TouchableOpacity
            onPress={e => punch(1)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => punch(2)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => punch(3)}
            style={{ ...styles.btn, backgroundColor: '#555' }}
          >
            <Text style={{ ...styles.btnText, color: '#f0f0f0' }}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => operation('+')}
            style={{ ...styles.btn, backgroundColor: 'orange' }}
          >
            <Text
              style={{ ...styles.btnText, color: '#fff', fontWeight: '700' }}
            >
              +
            </Text>
          </TouchableOpacity>
        </Row>
        <Row>
          <TouchableOpacity
            style={{
              ...styles.btn,
              backgroundColor: '#555',
              flex: 2,
              display: 'flex',
              alignItems: 'flex-start'
            }}
            onPress={e => punch(0)}
          >
            <Text
              style={{
                ...styles.btnText,
                color: '#f0f0f0',
                paddingLeft: 28
              }}
            >
              0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.btn, backgroundColor: '#555' }}
            onPress={e => dot('.')}
          >
            <Text
              style={{
                ...styles.btnText,
                color: '#f0f0f0',
                marginTop: -10
              }}
            >
              .
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => compute()}
            style={{ ...styles.btn, backgroundColor: 'orange' }}
          >
            <Text
              style={{ ...styles.btnText, color: '#fff', fontWeight: '700' }}
            >
              =
            </Text>
          </TouchableOpacity>
        </Row>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    backgroundColor: '#000',
    height: '100%'
    // padding: 32
  },
  inputContainer: {
    height: 150,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#000',
    fontSize: 20
  },
  buttonsContainer: {
    padding: 16,
    // backgroundColor: 'red',
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start'
  },
  row: {
    display: 'flex',
    // backgroundColor: 'blue',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  btn: {
    backgroundColor: '#ccc',
    flex: 1,
    display: 'flex',
    height: 65,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    margin: 8
  },
  btnText: {
    fontSize: 24,
    fontFamily: 'sans-serif',
    fontWeight: '300'
  },
  display: {
    color: '#fff',
    backgroundColor: '#333',
    fontSize: 50,
    width: '100%',
    textAlign: 'right',
    height: '100%',
    paddingRight: 16,
    paddingLeft: 16
  }
})
