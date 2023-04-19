this program shows the difference between using XREAD redis operation within a single connection or within separate connections.
# Instructions
- run a local redis server using
```sh
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```
- run the program
```sh
npm install # once
```
- runs with separate connections:
```sh
node index.js
```
This will show expected good results: a low delay between writing into the stream and reading from it:
```
[stream1] blocked during 762ms. there was 2 entries to read, delayed=2ms
[stream2] blocked during 72ms. there was 2 entries to read, delayed=2ms
[stream3] blocked during 826ms. there was nothing to read
[stream1] blocked during 208ms. there was 2 entries to read, delayed=3ms
[stream2] blocked during 335ms. there was 2 entries to read, delayed=3ms
[stream2] blocked during 20ms. there was 2 entries to read, delayed=3ms
[stream2] blocked during 401ms. there was 2 entries to read, delayed=2ms
[stream2] blocked during 22ms. there was 2 entries to read, delayed=2ms
[stream3] blocked during 805ms. there was nothing to read
[stream2] blocked during 218ms. there was 2 entries to read, delayed=1ms
[stream1] blocked during 971ms. there was 2 entries to read, delayed=3ms
[stream2] blocked during 416ms. there was 2 entries to read, delayed=4ms
[stream2] blocked during 23ms. there was 2 entries to read, delayed=2ms
[stream3] blocked during 519ms. there was 2 entries to read, delayed=3ms
[stream2] blocked during 91ms. there was 2 entries to read, delayed=4ms
[stream3] blocked during 266ms. there was 2 entries to read, delayed=4ms
[stream2] blocked during 232ms. there was 2 entries to read, delayed=2ms
[stream2] blocked during 328ms. there was 2 entries to read, delayed=3ms
[stream1] blocked during 1083ms. there was nothing to read
```
- runs using the same connection (one for reading one for writing):
```sh
node index.js --same-connection
```
The shown delays will be much higher then the previous case.
```
[stream1] blocked during 809ms. there was 2 entries to read, delayed=687ms
[stream2] blocked during 809ms. there was 2 entries to read, delayed=659ms
[stream3] blocked during 440ms. there was 2 entries to read, delayed=2ms
[stream1] blocked during 1220ms. there was 2 entries to read, delayed=3ms
[stream2] blocked during 1221ms. there was 2 entries to read, delayed=1159ms
[stream3] blocked during 781ms. there was 2 entries to read, delayed=89ms
[stream1] blocked during 228ms. there was 2 entries to read, delayed=2ms
[stream2] blocked during 229ms. there was 2 entries to read, delayed=207ms
[stream3] blocked during 1104ms. there was nothing to read
[stream1] blocked during 1735ms. there was 2 entries to read, delayed=4ms
[stream2] blocked during 1736ms. there was 2 entries to read, delayed=1670ms
[stream3] blocked during 1696ms. there was nothing to read
[stream1] blocked during 836ms. there was 2 entries to read, delayed=347ms
[stream2] blocked during 836ms. there was 2 entries to read, delayed=838ms
[stream3] blocked during 181ms. there was 2 entries to read, delayed=2ms
[stream1] blocked during 716ms. there was 2 entries to read, delayed=1ms
[stream2] blocked during 716ms. there was 2 entries to read, delayed=571ms
[stream3] blocked during 536ms. there was 2 entries to read, delayed=188ms
[stream1] blocked during 1012ms. there was nothing to read
[stream2] blocked during 1012ms. there was 2 entries to read, delayed=797ms
[stream3] blocked during 1821ms. there was nothing to read
[stream1] blocked during 809ms. there was 2 entries to read, delayed=404ms
[stream2] blocked during 809ms. there was 2 entries to read, delayed=582ms
[stream3] blocked during 609ms. there was 2 entries to read, delayed=3ms
[stream1] blocked during 609ms. there was 2 entries to read, delayed=394ms
[stream2] blocked during 609ms. there was 2 entries to read, delayed=551ms
[stream3] blocked during 494ms. there was 2 entries to read, delayed=2ms
```
Which means that calling `XREAD` and `BLOCK` operation within the connection has an influence on blocking other calls.