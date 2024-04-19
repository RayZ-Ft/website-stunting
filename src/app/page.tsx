"use client"

import { useDispatch } from "react-redux";
import * as tfjs from "@tensorflow/tfjs";
import Papa from "papaparse";

import { useAppSelector } from "@/lib/store";
import { convertClassificationNutritionalStatusToNumber, convertGenderToNumber } from "@/lib/utils/convert-classification-module";
import StandardScaler from "@/lib/utils/StandardScaler";
import { DataBalita } from "@/lib/models/DataBalita";
import {
  convertToTensor
} from "@/lib/features/tensor-state/tensor-state"
import { AppDispatch } from "@/lib/store";

export default function Home() {
  const getTensorState = useAppSelector((state) => state.tensorStateReducer.value)
  const dispatch = useDispatch<AppDispatch>()

  const getData = () => {
    const X = new Array();
    const y = new Array();

    const standardScaler = new StandardScaler()

    Papa.parse<DataBalita>('data_balita.csv', {
        download: true,
        dynamicTyping: true,
        header: true,
        step: (row, parse) => {
            if (
                row.data.umur_bulan !== undefined &&
                row.data.jenis_kelamin !== undefined &&
                row.data.tinggi_badan_cm !== undefined &&
                row.data.status_gizi !== undefined
            ) {
                X.push([row.data.umur_bulan, convertGenderToNumber(row.data.jenis_kelamin), row.data.tinggi_badan_cm]);
                y.push(convertClassificationNutritionalStatusToNumber(row.data.status_gizi));
            } else {
                console.log('Baris dilewati karena salah satu kolomnya undefined atau null:', row);
            }
        },
        complete: () => {
            const persenTrain = 80/100;
            const persenTest = 20/100;

            standardScaler.fit(X)
            const X_change = standardScaler.transform(X);

            const X_train = X_change.slice(0, (X_change.length * persenTrain));
            const y_train = y.slice(0, (y.length * persenTrain));

            const X_test = X_change.slice(0, (X_change.length * persenTest));
            const y_test = y.slice(0, (y.length * persenTest));

            // setTrainTensorState({
            //   x: tfjs.tensor2d(X_train),
            //   y: tfjs.tensor1d(y_train)
            // })

            // setTestTensorState({
            //   x: tfjs.tensor2d(X_test),
            //   y: tfjs.tensor1d(y_test)
            // })
            dispatch(convertToTensor({
              testTensor: {
                x: tfjs.tensor2d(X_test),
                y: tfjs.tensor1d(y_test)
              },
              trainTensor: {
                x: tfjs.tensor2d(X_train),
                y: tfjs.tensor1d(y_train)
              }
            }))
        }
    })
  }

  return (
    <>
      <div className="flex justify-center space-x-4">
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <button onClick={async () => {
            // console.log("X_train")
            // getTensorState.trainTensor.x.print()
            // console.log("")
            // console.log("")
            // console.log("y_train")
            // getTensorState.trainTensor.y.print()
            try {
              const model = await tfjs.loadLayersModel('/models/model.json')

              model.summary()

              const input_data = tfjs.tensor2d([[27, 74.3, 0]]);

              const mean: number[] = [30.252636907406067, 88.74001653890481, 0.4946435397059887];
              const scale: number[] = [17.594414240823852, 17.290223014107685, 0.4999713075098597];

              const input_data_scaled = input_data.sub(tfjs.tensor1d(mean)).div(tfjs.tensor1d(scale));

              const class_mapping: { [key: number]: string } = {0: 'severely stunted', 1: 'stunted', 2: 'normal', 3: 'tinggi'};

              const class_predict = (model.predict(input_data_scaled) as tfjs.Tensor<tfjs.Rank>).argMax(-1).dataSync()[0]
              console.log(class_mapping[class_predict])
            } catch (error) {
              console.log(`${error}`)
            }
          }}>Load and Test Model</button>
        </div>
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <button onClick={() => {
            console.log("X_test")
            getTensorState.testTensor.x.print()
            console.log("")
            console.log("")
            console.log("y_test")
            getTensorState.testTensor.y.print()
          }}>Print Test Data</button>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <div className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          <button onClick={getData}>Latih data</button>
        </div>
        <div className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          <button onClick={ async () => {
            try {
              console.log("tungu")
              const model = tfjs.sequential()

              model.add(tfjs.layers.dense({
                units: 128,
                activation: 'relu',
                inputShape: [3]
              }))
              model.add(tfjs.layers.dropout({rate: 0.2}))

              model.add(tfjs.layers.dense({
                units: 128,
                activation: 'relu',
              }))
              model.add(tfjs.layers.dropout({rate: 0.2}));

              
              model.add(tfjs.layers.dense({
                units: 64,
                activation: 'relu',
              }));

              model.add(tfjs.layers.dense({
                units: 4,
                activation: 'softmax'
              }));

              const optimizer = tfjs.train.adam(0.0001);

              model.compile({
                optimizer: optimizer,
                loss: 'sparseCategoricalCrossentropy',
                metrics: ['accuracy']
              });

              const earlyStopping = tfjs.callbacks.earlyStopping({
                  monitor: 'val_loss',
                  patience: 10,
                  minDelta: 0.001
              });
              
              const history = await model.fit(
                  getTensorState.trainTensor.x,
                  getTensorState.trainTensor.y,
                  {
                      epochs: 50,
                      batchSize: 64,
                      validationSplit: 0.1,
                      validationData: [
                        getTensorState.testTensor.x,
                        getTensorState.testTensor.y,
                      ],
                      callbacks: [earlyStopping]
                  }
              );
            } catch (error) {
              console.log(`${error}`)
            } finally{
              console.log("selesai")
            }
          }}>Taining model</button>
        </div>
      </div>
    </>
  );
}
