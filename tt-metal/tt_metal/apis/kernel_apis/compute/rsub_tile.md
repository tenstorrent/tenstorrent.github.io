# rsub_tile

### void ckernel::rsub_tile_init()

Please refer to documentation for any_init. 

### void ckernel::rsub_tile(uint32_t idst, uint32_t param0)

Performs element-wise computation of rsub ( rsub(x,y) = y -x) on each element of a tile and y is a constant param in DST register at index tile_index. The DST register buffer must be in acquired state via *acquire_dst* call. This call is blocking and is only available on the compute engine.

Return value: None

| Argument      | Description                                                                | Type      | Valid Range                                           | Required       |
|---------------|----------------------------------------------------------------------------|-----------|-------------------------------------------------------|----------------|
| idst          | The index of the tile in DST register buffer to perform the computation on | uint32_t  | Must be less than the size of the DST register buffer | True           |
| param0        | Constant value that is being subtracted from                               | uint32_t  |                                                       | True           |