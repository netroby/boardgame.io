import React from 'react';
import { makeMove, endTurn } from '../../both/action-creators';
import Game from '../../both/game';
import { GameLog } from './log';
import { createGameReducer } from '../../both/reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Debug } from '../debug/debug';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('GameLog', () => {
  const log = [
    makeMove({ type: 'moveA' }),
    endTurn(),
    makeMove({ type: 'moveB' }),
    endTurn(),
  ];
  const gamelog = Enzyme.mount(<GameLog log={log} />);
  const turns = gamelog.find('.id').map(div => div.text());
  expect(turns).toEqual(['Turn #1', 'Turn #2']);
});

test('GameLog rewind', () => {
  const game = Game({
    moves: {
      'A': (G, ctx, arg) => arg,
    }
  });
  const reducer = createGameReducer({game});
  const store = createStore(reducer);

  store.dispatch(makeMove({
    type: 'A',
    args: [1],
  }));

  store.dispatch(endTurn());

  store.dispatch(makeMove({
    type: 'A',
    args: [2],
  }));

  store.dispatch(endTurn());

  const root = Enzyme.mount(
      <Provider store={store}>
      <Debug gamestate={store.getState()} endTurn={() => {}} gameid="default" showLog={true} />
      </Provider>
  );

  expect(store.getState().G).toEqual(2);
  root.find('.log-turn').at(0).simulate('mouseover');
  expect(store.getState().G).toEqual(1);
  root.find('.log-turn').at(0).simulate('mouseout');
  expect(store.getState().G).toEqual(2);
});