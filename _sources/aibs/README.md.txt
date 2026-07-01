# Add-In Boards and Accessories

This section contains information about add-in boards and accessories.

- [Grayskull™ e75/e150 AI Graph Processor](./grayskull/README.md)
- [Wormhole™ n150s/n300s AI Graph Processor](./wormhole/README.md)
- [Active Cooling Kit](./ack.md)
- [Warp 100 Bridge](.\warp100.md)



## Add-In Board Comparison Table

| Specification                        | e75                                         | e150                               | n150s                                   | n300s                                   | n300d                                   |
| ------------------------------------ | ------------------------------------------- | ---------------------------------- | --------------------------------------- | --------------------------------------- | --------------------------------------- |
| Part Number                          | TC-01001                                    | TC-01002                           | TC-02001                                | TC-02003                                | TC-02004                                |
| ASIC(s)                              | Grayskull™                                  | Grayskull™                         | Wormhole™                               | 2x Wormhole™                            | 2x Wormhole™                            |
| Tensix Cores                         | 96                                          | 120                                | 72                                      | 128 (64 per ASIC)                       | 128 (64 per ASIC)                       |
| AI Clock                             | 1 GHz                                       | 1.2 GHz                            | 1 GHz                                   | 1 GHz                                   | 1 GHz                                   |
| SRAM                                 | 96MB                                        | 120MB                              | 108MB                                   | 192MB (96MB per ASIC)                   | 192MB (96MB per ASIC)                   |
| Memory                               | 8GB LPDDR4                                  | 8GB LPDDR4                         | 12GB GDDR6                              | 24GB GDDR6                              | 24GB GDDR6                              |
| Memory Speed                         | 3.2 GT/sec                                  | 3.7 GT/sec                         | 12 GT/sec                               | 12 GT/sec                               | 12 GT/sec                               |
| Memory Bandwidth                     | 102 GB/sec                                  | 118 GB/sec                         | 288 GB/sec                              | 576 GB/sec                              | 576 GB/sec                              |
| TeraFLOPs (FP8)                      | 221                                         | 332                                | 262                                     | 466                                     | 466                                     |
| TeraFLOPs (FP16)                     | 55                                          | 83                                 | 74                                      | 131                                     | 131                                     |
| TeraFLOPs (BFP8)                     | 55                                          | 83                                 | 148                                     | 262                                     | 262                                     |
| TBP (Total Board Power)              | 75W                                         | 200W                               | 160W                                    | 300W                                    | 300W                                    |
| External Power                       | 1x 6-pin PCIe *(required for powering fan)* | 1x 6+2-pin PCIe<br />1x 6-pin PCIe | 1x 4+4-pin EPS12V                       | 1x 4+4-pin EPS12V                       | 1x 4+4-pin EPS12V                       |
| Connectivity                         | -                                           | -                                  | 2x Warp 100 Bridge<br />2x QSFP-DD 400G | 2x Warp 100 Bridge<br />2x QSFP-DD 400G | 2x Warp 100 Bridge<br />2x QSFP-DD 400G |
| System Interface                     | PCI Express 4.0 x16                         | PCI Express 4.0 x16                | PCI Express 4.0 x16                     | PCI Express 4.0 x16                     | PCI Express 4.0 x16                     |
| Cooling                              | Active                                      | Passive                            | Passive                                 | Passive                                 | Active, 2.5-slot                        |
| Dimensions (w/o Cooling Kit) (WxDxH) | 18mm x 167.5mm x 69mm                       | 36mm x 259.8mm x 111.25mm          | 36mm x 254mm x 111mm                    | 36mm x 254mm x 111mm                    | N/A                                     |
| Dimensions (w/ Cooling Kit) (WxDxH)  | 18mm x 257mm x 98mm                         | 36mm x 399mm x 114mm               | 36mm x 393.5mm x 114mm                  | 36mm x 393.5mm x 114mm                  | 52.2mm x 256mm x 111mm                  |



## Data Precision Format Support

| Format                        | Abbr. | Grayskull™ (e75/e150) | Wormhole™ (n150s/n300s/n300d) |
| ----------------------------- | ----- | --------------------- | ----------------------------- |
| Floating Point (8-bit)        | FP8   | Yes                   | Yes                           |
| Floating Point (16-bit)       | FP16  | Yes                   | Yes                           |
| Brain Floating Point (16-bit) | BF16  | Yes                   | Yes                           |
| Floating Point (32-bit)       | FP32  | No                    | Output Only                   |
| Block Floating Point (2-bit)  | BFP2  | Yes                   | Yes                           |
| Block Floating Point (4-bit)  | BFP4  | Yes                   | Yes                           |
| Block Floating Point (8-bit)  | BFP8  | Yes                   | Yes                           |
| Integer (8-bit)               | INT8  | No                    | Yes                           |
| Integer (32-bit)              | INT32 | No                    | Output Only                   |
| Unsigned Integer (8-bit)      | UINT8 | No                    | Yes                           |
| TensorFloat (19-bit)          | TF32  | No                    | Yes                           |
| Vector FP32                   | VFP32 | No                    | Yes                           |
| Vector TF19                   | VTF19 | Yes                   | Yes                           |

