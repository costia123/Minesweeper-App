import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Button,
  TouchableOpacity,
  Image
} from 'react-native';
import Constants from './Constants';
import Images from './assets/Images';
import Cell from './components/Cell';

export default class App extends Component {

    constructor(props){
        super(props);
        this.state = { 
          FlagisOn: false
        }
        this.boardWidth = Constants.CELL_SIZE * Constants.BOARD_SIZE;
        this.grid = Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, idx) => {
            return Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, idx) => {
                return null;
            });
        });
    }

    onDie = () => {
        Alert.alert("BAH RIP ta exploser");
        for(let i=0; i<Constants.BOARD_SIZE; i++){
            for(let j=0; j<Constants.BOARD_SIZE; j++){
                this.grid[i][j].revealWithoutCallback();
            }
        }
    }

    revealNeighbors = (x, y) => {
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                if ((i != 0 || j != 0) && x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1){
                    this.grid[x + i][y + j].onReveal(false);
                }
            }
        }
    }
    onFlag = (x, y) => {
      console.log("in app")
      this.grid[x][y].setState(prevState =>({
        ...prevState,
        isFlag: true,
        revealed: true
      }))
    }
    onReveal = (x, y) => {
        let neighbors = 0;
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                if (x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1){
                    if (this.grid[x + i][y + j].state.isMine){
                        neighbors++;
                    }
                }
            }
        }

        if (neighbors){
            this.grid[x][y].setState({
                neighbors: neighbors
            })
        } else {
            this.revealNeighbors(x, y);
        }
    }

    renderBoard = () => {
        return Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, rowIdx) => {
            let cellList = Array.apply(null, Array(Constants.BOARD_SIZE)).map((el, colIdx) => {
                return <Cell
                    onReveal={this.onReveal}
                    onFlag={this.onFlag}
                    onDie={this.onDie}
                    key={colIdx}
                    width={Constants.CELL_SIZE}
                    height={Constants.CELL_SIZE}
                    x={colIdx}
                    y={rowIdx}
                    ref={(ref) => { this.grid[colIdx][rowIdx] = ref }}
                    FlagisOn={this.state.FlagisOn}
                />
            });

            return (
                <View key={rowIdx} style={{ width: this.boardWidth, height: Constants.CELL_SIZE, flexDirection: 'row'}}>
                    {cellList}
                </View>
            )
        });


    }

    resetGame = () => {
        for(let i=0; i<Constants.BOARD_SIZE; i++){
            for(let j=0; j<Constants.BOARD_SIZE; j++){
                this.grid[i][j].reset();
            }
        }
    }

    render() {
        return (
          <>
            <View style={styles.container}>
            <Text>Welcum to Costia's Minesweaper</Text>
            <TouchableOpacity style={this.state.FlagisOn ? { borderColor: "red", borderWidth: 2} : null} onPress={() => {this.setState({FlagisOn: !this.state.FlagisOn})
              }} >
              <Image source={Images.Flag} style={{width: 40, height: 40}} />
            </TouchableOpacity>
                <View style={{ width: this.boardWidth, height: this.boardWidth, backgroundColor: '#888888', flexDirection: 'column'}}>
                    {this.renderBoard()}
                </View>
                <Button title="Nouvelle partie" onPress={this.resetGame} />
            </View>
          </>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#bdbdbd'
    }
});
