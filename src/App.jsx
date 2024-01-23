import "./App.css";
import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriend, setShowAddFriend] = useState(false);
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((cur) =>
        cur.id === selectedFriend.id
          ? { ...cur, balance: cur.balance + value }
          : cur
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onFriendSelection={handleSelection}
        />
        {showAddFriend && <AddfriendForm onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <SplitForm
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onFriendSelection, selectedFriend }) {
  // const [newFriend, setNewFrien] = useState([]);

  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onFriendSelection={onFriendSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onFriendSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owes {friend.name} {Math.abs(friend.balance)}€
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you {friend.balance}€
          </p>
        )}
        {friend.balance == 0 && (
          <p>
            You and {friend.name} are even
            {/* {friend.balance}€ */}
          </p>
        )}

        <Button onClick={() => onFriendSelection(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
        {/* <button className="button">Select</button> */}
      </li>
    </>
  );
}
function AddfriendForm({ onAddFriend }) {
  const [name, setName] = useState(null);
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <div>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>👫Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>🌄Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Button>Add</Button>
      </form>
    </div>
  );
}

function SplitForm({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByuser, setPaidByuser] = useState("");
  const paidByFriend = bill ? bill - paidByuser : "";
  const [whoisPaying, setWhoisPaying] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByuser) return;
    onSplitBill(whoisPaying === "user" ? paidByFriend : -paidByuser);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={paidByuser}
        onChange={(e) =>
          setPaidByuser(
            Number(e.target.value) > bill ? bill : Number(e.target.value)
          )
        }
      />
      <label>👫 {selectedFriend.name} expense</label>
      <input disabled value={paidByFriend} />
      <label htmlFor="">🤑 Who is paying the bill</label>
      <select
        value={whoisPaying}
        onChange={(e) => setWhoisPaying(e.target.value)}>
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
