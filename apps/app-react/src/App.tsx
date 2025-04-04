import "./assets/main.css";
import { Dispatch, memo, useReducer } from "react";

const random = (max: number) => Math.round(Math.random() * 1000) % max;

const A = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
];
const C = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
];
const N = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
];

let nextId = 1;
type Data = {
  id: number;
  label: string;
};
const buildData = (count: number): Data[] => {
  const data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    };
  }

  return data;
};

const initialState = { data: [] as Data[], selected: 0 };

type State = typeof initialState;
type Action = {
  id?: number;
  type: string;
};

const listReducer = (state: State, action: Action): State => {
  const { data, selected } = state;

  switch (action.type) {
    case "RUN":
      return { data: buildData(1000), selected: 0 };
    case "RUN_LOTS":
      return { data: buildData(10000), selected: 0 };
    case "ADD":
      return { data: data.concat(buildData(1000)), selected };
    case "UPDATE": {
      const newData = data.slice(0);

      for (let i = 0; i < newData.length; i += 10) {
        const r = newData[i];

        newData[i] = { id: r.id, label: r.label + " !!!" };
      }

      return { data: newData, selected };
    }
    case "CLEAR":
      return { data: [], selected: 0 };
    case "SWAP_ROWS":
      const newdata = [...data];
      if (data.length > 998) {
        const d1 = newdata[1];
        const d998 = newdata[998];
        newdata[1] = d998;
        newdata[998] = d1;
      }
      return { data: newdata, selected };
    case "REMOVE": {
      return { data: data.filter((d) => d.id !== action.id), selected };
    }
    case "SELECT":
      return { data, selected: action.id! };
    default:
      return state;
  }
};

type RowProps = {
  selected: boolean;
  item: { id: number; label: string };
  dispatch: Dispatch<Action>;
};

const Row = memo(
  ({ selected, item, dispatch }: RowProps) => (
    <tr className={selected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => dispatch({ type: "SELECT", id: item.id })}>
          {item.label}
        </a>
      </td>
      <td className="col-md-1">
        <a onClick={() => dispatch({ type: "REMOVE", id: item.id })}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  ),
  (prevProps, nextProps) =>
    prevProps.selected === nextProps.selected &&
    prevProps.item === nextProps.item,
);

type ButtonProps = {
  id: string;
  cb: () => void;
  title: string;
};

const Button = ({ id, cb, title }: ButtonProps) => (
  <div className="col-sm-6 smallpad">
    <button
      type="button"
      className="btn btn-primary btn-block"
      id={id}
      onClick={cb}
    >
      {title}
    </button>
  </div>
);

type JumbotronProps = {
  dispatch: Dispatch<Action>;
};

const Jumbotron = memo(
  ({ dispatch }: JumbotronProps) => (
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>React App</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <Button
              id="run"
              title="Create 1,000 rows"
              cb={() => dispatch({ type: "RUN" })}
            />
            <Button
              id="runlots"
              title="Create 10,000 rows"
              cb={() => dispatch({ type: "RUN_LOTS" })}
            />
            <Button
              id="add"
              title="Append 1,000 rows"
              cb={() => dispatch({ type: "ADD" })}
            />
            <Button
              id="update"
              title="Update every 10th row"
              cb={() => dispatch({ type: "UPDATE" })}
            />
            <Button
              id="clear"
              title="Clear"
              cb={() => dispatch({ type: "CLEAR" })}
            />
            <Button
              id="swaprows"
              title="Swap Rows"
              cb={() => dispatch({ type: "SWAP_ROWS" })}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  () => true,
);

export const App = () => {
  const [{ data, selected }, dispatch] = useReducer(listReducer, initialState);

  return (
    <div className="container">
      <Jumbotron dispatch={dispatch} />
      <table className="table table-hover table-striped test-data">
        <tbody>
          {data.map((item) => (
            <Row
              key={item.id}
              item={item}
              selected={selected === item.id}
              dispatch={dispatch}
            />
          ))}
        </tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      />
    </div>
  );
};
