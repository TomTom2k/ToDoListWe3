// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ToDoList {
    uint256 public _idUser;
    address public ownerOfContract;

    address[] public creators;
    string[] public message;
    uint256[] public messageId;

    struct ToDolistApp {
        address account;
        uint256 userId;
        string message;
        bool completed;
    }

    event ToDoEvent(
        address indexed account,
        uint256 indexed userId,
        string message,
        bool completed
    );

    mapping(address => ToDolistApp) public toDolistApps;

    constructor() {
        ownerOfContract = msg.sender;
    }

    function inc() internal {
        _idUser++;
    }

    function createList(string calldata _message) external {
        inc();

        uint256 idNumber = _idUser;
        ToDolistApp storage toDo = toDolistApps[msg.sender];

        toDo.account = msg.sender;
        toDo.message = _message;
        toDo.completed = false;
        toDo.userId = idNumber;

        creators.push(msg.sender);
        message.push(_message);
        messageId.push(idNumber);

        emit ToDoEvent(msg.sender, toDo.userId, _message, toDo.completed);
    }

    function getCreatorData(
        address _address
    ) public view returns (address, uint256, string memory, bool) {
        ToDolistApp memory singleUserData = toDolistApps[_address];

        return (
            singleUserData.account,
            singleUserData.userId,
            singleUserData.message,
            singleUserData.completed
        );
    }

    function getAddress() external view returns (address[] memory) {
        return creators;
    }

    function getMessage() external view returns (string[] memory) {
        return message;
    }

    function toggle(address _creator) public {
        ToDolistApp storage singleUserData = toDolistApps[_creator];
        singleUserData.completed = !singleUserData.completed;
    }
}
