'use client'
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import io from 'socket.io-client';
import axios from "axios";
require('dotenv').config();

export default function Home() {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BASE_URL, { transports: ['websocket'] });

    newSocket.on('connect', () => {
      console.log("socket connected...");
      newSocket.on("data", (arg) => {
        console.log("Received data ---->", arg);
      });
    });

    newSocket.on("event", (data) => {
      setDataList(prevDataList => [...prevDataList, data]);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const showData = async () => {
    await axios(`${process.env.NEXT_PUBLIC_BASE_URL}/get-trade-details`);
  }

  return (
    <main className={styles.main}>
      <div>
        <button onClick={showData} className={styles.showButton}>Show Data</button>
        <h2>Data Received from Socket:</h2>
        <div className={styles.dataContainer}>
          <div className={styles.dataBox}>
            <ul className={styles.dataList}>
              {dataList.map((data, index) => (
                <li key={index} className={styles.dataItem}>
                  <p>Symbol: {data?.symbol}</p>
                  <p>Operation: {data?.operation}</p>
                  <p>Volume: {data?.volume}</p>
                  <p>Take Profit: {data?.takeProfit}</p>
                  <p>Comment: {data?.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
