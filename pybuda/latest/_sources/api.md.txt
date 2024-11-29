# API Reference

## Python Runtime API

| [`run_inference`](#pybuda.run_inference)([module, inputs, input_count, ...])           | Main "run" function for inference.                                                                                  |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| [`run_training`](#pybuda.run_training)([epochs, steps, ...])                           | Main "run" function for training.                                                                                   |
| [`initialize_pipeline`](#pybuda.initialize_pipeline)(training[, ...])                  | Initialize the pipeline to run inference and training through manual run_forward, run_backward, run_optimizer, etc. |
| [`run_forward`](#pybuda.run_forward)([input_count, \_sequential])                      | Run forward passes on the pre-compiled and initialized pipeline of devices.                                         |
| [`run_backward`](#pybuda.run_backward)([input_count, zero_grad, ...])                  | Run backward passes on the pre-compiled and initialized pipeline of devices.                                        |
| [`run_optimizer`](#pybuda.run_optimizer)([checkpoint, \_sequential])                   | Run optimizer on all devices.                                                                                       |
| [`get_parameter_checkpoint`](#pybuda.get_parameter_checkpoint)([device, \_sequential]) | Return current parameter values.                                                                                    |
| [`get_parameter_gradients`](#pybuda.get_parameter_gradients)([device, \_sequential])   | Return currently accumulated parameter gradients.                                                                   |
| [`update_device_parameters`](#pybuda.update_device_parameters)([device, ...])          | Push new parameters onto given device, or if none is provided, then all devices in the pipeline.                    |
| [`shutdown`](#pybuda.shutdown)()                                                       | Shutdown running processes and clean up pybuda                                                                      |

<a id="module-0"></a>

### run_inference(module: [PyBudaModule](#pybuda.PyBudaModule) | None = None, inputs: List[Tuple[Tensor | Tensor, ...] | Dict[str, Tensor | Tensor]] = [], input_count: int = 1, output_queue: Queue | None = None, \_sequential: bool = False, \_perf_trace: bool = False, \_verify_cfg: VerifyConfig | None = None)

Main “run” function for inference. After all modules have been defined and placed on devices, this will
execute the workload. Unless ‘sequential’ is set, the function will return as soon as the devices are set up
to run, and inference will run as long as new inputs are pushed into the device(s). If sequential mode is on,
the function will run through inputs that are already in the input buffer and return when done.

* **Parameters:**
  * **module** ([*PyBudaModule*](#pybuda.PyBudaModule) *,* *optional*) – If provided, place given module on a TT Device and run inference. Alternatively, manually create device(s) and
    placed module(s) on them.
  * **inputs** (*List* *[**Union* *[**Tuple* *[**Union* *[**torch.Tensor* *,* *Tensor* *]* *,*  *...* *]* *,* *Dict* *[**str* *,* *Union* *[**torch.Tensor* *,* *Tensor* *]* *]* *]* *]* *,* *optional*) – An optional list of input tensor tuples or dictionaries (passed as args or kwargs to module), to feed into the inference pipeline.
    Alternatively, use device.push_to_inputs to manually provide inputs outside of this call.
  * **input_count** (*int* *,* *default=1*) – The number of inputs to run inference on. If 0, inference will run “forever”, until shutdown or run_inference
    is called again.
  * **output_queue** (*queue.Queue* *,* *optional*) – If provided, outputs will be pushed into the queue as they are calculated. Otherwise, one will be created
    and returned.
  * **\_sequential** (*bool* *,* *Internal*) – Don’t use.
  * **\_perf_trace** (*bool* *,* *Internal*) – Don’t use.
  * **\_verify_cfg** (*Internal*) – Don’t use.
* **Returns:**
  Queue holding the output results. Either the output_queue provided, or one that’s created.
* **Return type:**
  queue.Queue

### run_training(epochs: int = 1, steps: int = 1, accumulation_steps: int = 1, microbatch_count: int = 1, checkpoint_queue: Queue | None = None, loss_queue: Queue | None = None, checkpoint_interval: int = 0, \_sequential: bool = False, \_perf_trace: bool = False, \_verify_cfg: VerifyConfig | None = None)

Main “run” function for training. After all modules have been defined and placed on devices, this will
execute the workload.

* **Parameters:**
  * **epochs** (*int*) – The number of epoch to run. Scheduler, if provided, will be stepped after each one.
  * **steps** (*int*) – The number of batches to run. After every step, the optimizer will be stepped.
  * **accumulation_steps** (*int*) – The number of mini-batches in a batch. Each mini-batch is limited in size by how much of the
    intermediate data can fit in device memory.
  * **microbatch_count** (*int*) – Each mini-batch is optionally further broken into micro-batches. This is necessary to fill a
    multi-device pipeline, and should be roughly 4-6x the number of devices in the pipeline for ideal
    performance.
  * **checkpoint_queue** (*Queue* *,* *optional*) – If provided, weight checkpoints will be pushed into this queue, along with the final set of weights.
    If one is not provided, one will be created and returned.
  * **loss_queue** (*Queue* *,* *optional*) – If provided, loss values will be pushed into this queeu.
  * **checkpoint_interval** (*int* *,* *optional*) – The weights will be checkpointed into checkpoint queues on host every checkpoint_interval optimizer
    steps, if set to non-zero. Zero by default.
  * **\_sequential** (*Internal*) – Don’t use
  * **\_perf_trace** (*Internal*) – Don’t use
  * **\_verify_cfg** (*Internal*) – Don’t use.
* **Returns:**
  Checkpoint queue, holding weight checkpoints, and final trained weights.
* **Return type:**
  queue.Queue

### shutdown()

Shutdown running processes and clean up pybuda

### initialize_pipeline(training: bool, output_queue: ~queue.Queue | None = None, checkpoint_queue: ~queue.Queue | None = None, sample_inputs: ~typing.Tuple[~torch.Tensor | ~pybuda.tensor.Tensor, ...] | ~typing.Dict[str, ~torch.Tensor | ~pybuda.tensor.Tensor] = (), sample_targets: ~typing.Tuple[~torch.Tensor | ~pybuda.tensor.Tensor, ...] = (), microbatch_count: int = 1, d2d_fwd_queues: ~typing.List[~queue.Queue] = [], d2d_bwd_queues: ~typing.List[~queue.Queue] = [], \_sequential: bool = False, \_verify_cfg: ~pybuda.verify.config.VerifyConfig | None = None, \_device_mode: ~pybuda._C.backend_api.DeviceMode = <DeviceMode.CompileAndRun: 0>)

Initialize the pipeline to run inference and training through manual run_forward, run_backward, run_optimizer, etc. calls. This should be not used with
“all-in-one” APIs like run_inference and run_training, which will initialize the pipeline themselves.

* **Parameters:**
  * **training** (*bool*) – Set to true to prepare the pipeline for training.
  * **output_queue** (*queue.Queue* *,* *optional*) – If provided, inference outputs will be pushed into the queue as they are calculated. Otherwise, one will be created
    and returned (in inference mode)
  * **checkpoint_queue** (*Queue* *,* *optional*) – If provided, weight checkpoints will be pushed into this queue, along with the final set of weights.
    If one is not provided, one will be created and returned (in training mode)
  * **sample_inputs** (*Tuple* *[**Union* *[**torch.Tensor* *,* *Tensor* *]* *,*  *...* *]* *,* *optional*) – If calling initialize_pipeline directly to compile models and initialize devices, then a representative sample
    of inputs must be provided to accuractely compile the design. Typically, this would be the first input that
    will be sent through the model post-compile. The tensors must be of the correct shape and data type.
  * **sample_targets** (*Tuple* *[**Union* *[**torch.Tensor* *,* *Tensor* *]* *,*  *...* *]* *,* *optional*) – If calling initialize_pipeline directly to compile models and initialize devices for training, then a
    representative sample of training tagets must be provided to accuractely compile the design.
    Typically, this would be the first target that will be sent to the last device post-compile.
    The tensors must be of the correct shape and data type.
  * **microbatch_count** (*int*) – Only relevant for training. This represents the number of microbatches that are pushed through
    fwd path before bwd path runs. The device will ensure that buffering is large enough to contain
    microbatch_count number of microbatch intermediate data.
  * **d2d_fwd_queues** (*List* *[**queue.Queue* *]* *,* *optional*) – If provided, device-to-device intermediate data that passes through host will also be stored in the provided
    queues. The queues are assigned in order from the first device in the pipeline. The last device will not
    be assigned a queue.
  * **d2d_bwd_queues** (*List* *[**queue.Queue* *]* *,* *optional*) – If provided, device-to-device intermediate data in the training backward pass, that passes through
    host will also be stored in the provided queues. The queues are assigned in order from the
    second device in the pipeline. The first device will not be assigned a queue.
  * **\_sequential** (*Internal*) – Don’t use
  * **\_verify_cfg** (*Internal*) – Don’t use.
* **Returns:**
  Output queue for inference, or checkpoint queue for training
* **Return type:**
  queue.Queue

### run_forward(input_count: int = 1, \_sequential: bool = False)

Run forward passes on the pre-compiled and initialized pipeline of devices. This API should be
called from custom implementations of inference and training loops, in lieue of calling
run_inference and run_training APIs.

If this is a part of an inference run, the results will be placed in the outptut queues which
should have already been setup through initialize_pipeline call. If this is called as a part
of the training pass, then loss will be pushed to the output queue, if one was set up.

* **Parameters:**
  * **input_count** (*int* *,* *default=1*) – The number of inputs to run inference on. If 0, inference will run “forever”, until shutdown or run_inference
    is called again.
  * **\_sequential** (*Internal*) – Don’t use

### run_backward(input_count: int = 1, zero_grad: bool = False, \_sequential: bool = False)

Run backward passes on the pre-compiled and initialized pipeline of devices. This API should be
called from custom implementations of inference and training loops, in lieue of calling
run_inference and run_training APIs.

zero_grad should be set for the first backward call of a batch, to zero out accumulated gradients.

No results will be returned. get_parameter_gradients() can be used to get a snapshot of
gradients after the backward pass has completed.

* **Parameters:**
  * **input_count** (*int* *,* *default=1*) – The number of inputs to run inference on. If 0, inference will run “forever”, until shutdown or run_inference
    is called again.
  * **zero_grad** (*bool* *,* *optional*) – If set, acccumulated gradients on device will be zeroed out before the backward pass begins.
  * **\_sequential** (*Internal*) – Don’t use

### run_optimizer(checkpoint: bool = False, \_sequential: bool = False)

Run optimizer on all devices. If checkpoint is set, a checkpoint of parameters will be taken and
placed into the checkpoint queue that has been set up during initialize_pipeline call.

* **Parameters:**
  * **checkpoint** (*bool* *,* *optional*) – If set, checkpoint of parameters will be placed into checkpoint queue.
  * **\_sequential** (*Internal*) – Don’t use

### get_parameter_checkpoint(device: [CPUDevice](#pybuda.CPUDevice) | [TTDevice](#pybuda.TTDevice) | None = None, \_sequential: bool = False)

Return current parameter values. If a device is specified, only parameters for that device will
be returned, otherwise a list of parameters for all devices will come back.

* **Parameters:**
  * **device** (*Union* *[*[*CPUDevice*](#pybuda.CPUDevice) *,* [*TTDevice*](#pybuda.TTDevice) *]* *,* *Optional*) – Device to read parameter values from. If None, all devices will be read from.
  * **\_sequential** (*Internal*) – Don’t use
* **Returns:**
  List of parameter checkpoints for devices in the pipeline, or the given device
* **Return type:**
  List[Dict[str, Tensor]]

### get_parameter_gradients(device: [CPUDevice](#pybuda.CPUDevice) | [TTDevice](#pybuda.TTDevice) | None = None, \_sequential: bool = False)

Return currently accumulated parameter gradients. If a device is specified, only gradients for that device
will be returned, otherwise a list of gradients for all devices will come back.

* **Parameters:**
  * **device** (*Union* *[*[*CPUDevice*](#pybuda.CPUDevice) *,* [*TTDevice*](#pybuda.TTDevice) *]* *,* *Optional*) – Device to read parameter gradients from. If None, all devices will be read from.
  * **\_sequential** (*Internal*) – Don’t use
* **Returns:**
  List of parameter checkpoints for devices in the pipeline, or the given device
* **Return type:**
  List[Dict[str, Tensor]]

### update_device_parameters(device: [CPUDevice](#pybuda.CPUDevice) | [TTDevice](#pybuda.TTDevice) | None = None, parameters: List[Dict[str, Tensor]] = [], \_sequential: bool = False)

Push new parameters onto given device, or if none is provided, then all devices in the pipeline.

* **Parameters:**
  * **device** (*Union* *[*[*CPUDevice*](#pybuda.CPUDevice) *,* [*TTDevice*](#pybuda.TTDevice) *]* *,* *Optional*) – Device to read parameter values from. If None, all devices will be read from.
  * **parameters** (*List* *[**Dict* *[**str* *,* *torch.Tensor* *]* *]*) – List of dictionaries of parameters to update
  * **\_sequential** (*Internal*) – Don’t use

## C++ Runtime API

The BUDA Backend used by Python Runtime can be optionally used stand-alone to run pre-compiled TTI models. The API reference for stand-alone BUDA Backend Runtime can be found [here](http://yyz-webservice-02.local.tenstorrent.com/docs/budabackend-docs/).

## Configuration and Placement

| [`set_configuration_options`](#pybuda.set_configuration_options)([...])   | Set global compile configuration options.                                     |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| [`set_epoch_break`](#pybuda.set_epoch_break)(op_names)                    | Instruct place & route to start a new placement epoch on the given op(s)      |
| [`set_chip_break`](#pybuda.set_chip_break)(op_names)                      | Instruct place & route to start placing ops on the next chip in the pipeline. |
| [`override_op_size`](#pybuda.override_op_size)(op_name, grid_size)        | Override automatic op sizing with given grid size.                            |
| [`detect_available_devices`](#pybuda.detect_available_devices)()          | Returns a list of available devices on the system.                            |

<a id="module-1"></a>

### set_configuration_options(enable_recompute: bool | None = None, balancer_policy: str | None = None, place_on_one_row: bool | None = None, enable_t_streaming: bool | None = None, manual_t_streaming: bool | None = None, enable_consteval: bool | None = None, default_df_override: [DataFormat](#pybuda.DataFormat) | None = None, accumulate_df: [DataFormat](#pybuda.DataFormat) | None = None, math_fidelity: [MathFidelity](#pybuda.MathFidelity) | None = None, performance_trace: PerfTraceLevel | None = None, backend_opt_level: int | None = None, backend_output_dir: str | None = None, backend_device_descriptor_path: str | None = None, backend_cluster_descriptor_path: str | None = None, backend_runtime_params_path: str | None = None, backend_runtime_args: str | None = None, enable_auto_fusing: bool | None = None, enable_conv_prestride: bool | None = None, enable_stable_softmax: bool | None = None, amp_level: int | None = None, harvested_rows: List[List[int]] | None = None, store_backend_db_to_yaml: bool | None = None, input_queues_on_host: bool | None = None, output_queues_on_host: bool | None = None, enable_auto_transposing_placement: bool | None = None, use_interactive_placer: bool | None = None, op_intermediates_to_save: List[str] | None = None, enable_enumerate_u_kt: bool | None = None, enable_device_tilize: bool | None = None, dram_placement_algorithm: DRAMPlacementAlgorithm | None = None, chip_placement_policy: str | None = None, enable_forked_dram_inputs: bool | None = None, device_config: str | None = None)

Set global compile configuration options.

* **Parameters:**
  * **enable_recompute** (*Optional* *[**bool* *]*) – For training only. Enable ‘recompute’ feature which significantly reduces memory requirements at a cost of
    some performance.
  * **balancer_policy** (*Optional* *[**str* *]*) – 

    Override default place & route policy. Valid values are:

    ”NLP”: Custom policy with reasonable defaults for NLP-like models
    “Ribbon”: Custom policy with reasonable defaults for CNN-like models

    [DEBUG ONLY]
    “MaximizeTMinimizeGrid”: Maximize t-streaming. Verification only.
    “MinimizeGrid”: Super simple policy that always chooses smallest grid. Verification only.
    “Random”: Pick random valid grids for each op. Verification only.

    [DEPRECATED]
    “CNN”
  * **place_on_one_row** (*Optional* *[**bool* *]*) – For place & route to place every op on one row of cores only.
  * **enable_t_streaming** (*Optional* *[**bool* *]*) – Enable buffering optimization which reduces memory usage and latency.
  * **manual_t_streaming** (*Optional* *[**bool* *]*) – Only respect override_t_stream_dir op overrides, otherwise no streaming.
    enable_t_streaming must also be true to take effect.
  * **enable_consteval** (*Optional* *[**bool* *]*) – Use constant propagation to simplify the model.
  * **default_df_override** (*Optional* *[*[*DataFormat*](#pybuda.DataFormat) *]* *,* *None default*) – Set the default override for all node data formats, None means automatically inferred
  * **accumulate_df** (*Optional* *[*[*DataFormat*](#pybuda.DataFormat) *]* *,* *Float16_b default*) – Set default accumulation format for all operations, if supported by the device.
  * **math_fidelity** (*Optional* *[*[*MathFidelity*](#pybuda.MathFidelity) *]* *,* *MathFidelity.HiFi3 default*) – Set default math fidelity for all operations
  * **performance_trace** (*Optional* *[**PerfTraceLevel* *]*) – Set to value other than None to enable performance tracing. Note that the Verbose level could have impact on the performance due
    to the amount of data being captured and stored.
  * **backend_opt_level** (*Optional* *[**int* *]*) – The level of performance optimization in backend runtime (0-3)
  * **backend_output_dir** (*Optional* *[**str* *]*) – Set location for backend compile temporary files and binaries
  * **backend_device_descriptor_path** (*Optional* *[**str* *]*) – Set location for YAML file to load device descriptor
  * **backend_cluster_descriptor_path** (*Optional* *[**str* *]*) – Set location for YAML file to load multi-device cluster descriptor
  * **backend_runtime_params_path** (*Optional* *[**str* *]*) – Set location for YAML file to dump/load backend database configurations
  * **enable_auto_fusing** (*Optional* *[**bool* *]*) – Enabling automatic fusing of small operations into complex ops
  * **enable_conv_prestride** (*Optional* *[**bool* *]*) – Enabling host-side convolution prestiding (occurs during host-tilizer) for more efficient first convolution layer.
  * **amp_level** (*Optional* *[**int* *]*) – Configures the optimization setting for Automatic Mixed Precision (AMP).
    0: No Optimization (default)
    1: Optimizer ops are set with { OutputDataFormat.Float32, MathFidelity.HiFi4 }
  * **harvested_rows** (*Optional* *[**List* *[**int* *]* *]*) – Configures manually induced harvested rows. Only row-indices within 1-5 or 7-11 are harvestable.
  * **store_backend_db_to_yaml** (*Optional* *[**bool* *]*) – Enabling automatic backend database configuration dump to the YAML file specified with backend_runtime_param_path.
    Note that all backend configurations are loaded from the YAML file if existing YAML file is specified and this flag is set to False.
  * **use_interactive_placer** (*Optional* *[**bool* *]*) – Enable or disable usage of interactive placer within balancer policies which support it. Enabled by default.
  * **enable_device_tilize** (*Optional* *[**bool* *]*) – Enable or Disable Tilize Op on the embedded platform
  * **chip_placement_policy** (*Optional* *[**str* *]*) – Determine the order of the chip ids used in placement
  * **dram_placement_algorithm** (*Optional* *[**pyplacer.DRAMPlacementAlgorithm* *]*) – Set the algorithm to use for DRAM placement. Valid values are: ROUND_ROBIN, ROUND_ROBIN_FLIP_FLOP, GREATEST_CAPACITY, CLOSEST
  * **enable_forked_dram_inputs** (*Optional* *[**bool* *]*) – Enable or Disable Forked Dram Optimization
  * **device_config** (*Optional* *[**str* *]*) – Configure and Set runtime_param.yaml for offline WH compile based on the value.
    YAML files for supported configurations are mapped at ‘supported_backend_configurations’

### set_epoch_break(op_names: str | NodePredicateBuilder | List[str | NodePredicateBuilder])

Instruct place & route to start a new placement epoch on the given op(s)

* **Parameters:**
  **op_names** (*Union* *[**str* *,* *query.NodePredicateBuilder* *,* *List* *[**Union* *[**str* *,* *query.NodePredicateBuilder* *]* *]* *]*) – Op or ops or predicate matches to start a new placement epoch

### set_chip_break(op_names: str | NodePredicateBuilder | List[str | NodePredicateBuilder])

Instruct place & route to start placing ops on the next chip in the pipeline.

* **Parameters:**
  **op_names** (*Union* *[**str* *,* *query.NodePredicateBuilder* *,* *List* *[**Union* *[**str* *,* *query.NodePredicateBuilder* *]* *]* *]*) – Op or ops or predicate matches to start a new chip

### override_op_size(op_name: str, grid_size: Tuple[int, int])

Override automatic op sizing with given grid size.

* **Parameters:**
  * **op_name** (*str*) – Name of the op to override
  * **grid_size** (*Tuple* *[**int* *,* *int* *]*) – Rectangular shape (row, column) of the placed op

### detect_available_devices()

Returns a list of available devices on the system.

## Operations

### General

| [`Matmul`](#pybuda.op.Matmul)(name, operandA, operandB[, bias])     | Matrix multiplication transformation on input activations, with optional bias.   |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------|
| [`Add`](#pybuda.op.Add)(name, operandA, operandB)                   | Elementwise add of two tensors                                                   |
| [`Subtract`](#pybuda.op.Subtract)(name, operandA, operandB)         | Elementwise subtraction of two tensors                                           |
| [`Multiply`](#pybuda.op.Multiply)(name, operandA, operandB)         | Elementwise multiply of two tensors                                              |
| [`ReduceSum`](#pybuda.op.ReduceSum)(name, operandA, dim)            | Reduce by summing along the given dimension                                      |
| [`ReduceAvg`](#pybuda.op.ReduceAvg)(name, operandA, dim)            | Reduce by averaging along the given dimension                                    |
| [`Constant`](#pybuda.op.Constant)(name, \*, constant)               | Op representing user-defined constant                                            |
| [`Identity`](#pybuda.op.Identity)(name, operandA[, unsqueeze, ...]) | Identity operation.                                                              |
| [`Buffer`](#pybuda.op.Buffer)(name, operandA)                       | Identity operation.                                                              |

<a id="module-pybuda.op"></a>

### Matmul(name: str, operandA: Tensor, operandB: Tensor | Parameter, bias: Tensor | Parameter | None = None)

Matrix multiplication transformation on input activations, with optional bias. y = ab + bias

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – Input operand A
  * **operandB** (*Tensor*) – Input operand B
  * **bias** (*Tenor* *,* *optional*) – Optional bias tensor

### Add(name: str, operandA: Tensor, operandB: Tensor | Parameter)

Elementwise add of two tensors

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **operandB** (*Tensor*) – Second operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Subtract(name: str, operandA: Tensor, operandB: Tensor)

Elementwise subtraction of two tensors

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **operandB** (*Tensor*) – Second operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Multiply(name: str, operandA: Tensor, operandB: Tensor | Parameter)

Elementwise multiply of two tensors

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **operandB** (*Tensor*) – Second operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Identity(name: str, operandA: Tensor, unsqueeze: str | None = None, unsqueeze_dim: int | None = None)

Identity operation.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **unsqueeze** (*str*) – If set, the operation returns a new tensor with a dimension of size one inserted at the specified position.
  * **unsqueeze_dim** (*int*) – The index at where singleton dimenion can be inserted
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Buffer(name: str, operandA: Tensor)

Identity operation. One key difference is a Buffer op will not get
lowered into a NOP and avoid being removed by the time it gets to lowering.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### ReduceSum(name: str, operandA: Tensor, dim: int)

Reduce by summing along the given dimension

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **dim** (*int*) – Dimension along which to reduce. A positive number 0 - 3 or negative from -1 to -4.
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### ReduceAvg(name: str, operandA: Tensor, dim: int)

Reduce by averaging along the given dimension

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **dim** (*int*) – Dimension along which to reduce. A positive number 0 - 3 or negative from -1 to -4.
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Constant(name: str, \*, constant: float)

Op representing user-defined constant

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **constant** (*float*) – Constant value
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Transformations

| [`HSlice`](#pybuda.op.HSlice)(name, operandA, slices)                   | Slice along horizontal axis into given number of pieces.   |
|-------------------------------------------------------------------------|------------------------------------------------------------|
| [`VSlice`](#pybuda.op.VSlice)(name, operandA, slices)                   | Slice along vertical axis into given number of pieces.     |
| [`HStack`](#pybuda.op.HStack)(name, operandA[, slices])                 | Stack Z dimension along horizontal dimension.              |
| [`VStack`](#pybuda.op.VStack)(name, operandA[, slices])                 | Stack Z dimension along vertical dimension.                |
| [`Reshape`](#pybuda.op.Reshape)(name, operandA, shape)                  | TM                                                         |
| [`Index`](#pybuda.op.Index)(name, operandA, dim, start[, stop, stride]) | TM                                                         |
| [`Select`](#pybuda.op.Select)(name, operandA, dim, index[, stride])     | TM                                                         |
| [`Pad`](#pybuda.op.Pad)(name, operandA, pad[, mode, channel_last])      | TM                                                         |
| [`Concatenate`](#pybuda.op.Concatenate)(name, \*operands, axis)         | Concatenate tensors along axis                             |
| [`BinaryStack`](#pybuda.op.BinaryStack)(name, operandA, operandB, dim)  | Elementwise max of two tensors                             |
| [`Heaviside`](#pybuda.op.Heaviside)(name, operandA, operandB)           | Elementwise max of two tensors                             |

<a id="module-2"></a>

### Heaviside(name: str, operandA: Tensor, operandB: Tensor | Parameter)

Elementwise max of two tensors

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **operandB** (*Tensor*) – Second operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### BinaryStack(name: str, operandA: Tensor, operandB: Tensor | Parameter, dim: int)

Elementwise max of two tensors

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **operandB** (*Tensor*) – Second operand
  * **dim** (*int*) – Dimention on which to stack
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### HSlice(name: str, operandA: Tensor, slices: int)

Slice along horizontal axis into given number of pieces.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **slices** (*int*) – The number of slices to create
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### HStack(name: str, operandA: Tensor, slices: int = -1)

Stack Z dimension along horizontal dimension.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **slices** (*int* *,* *optional*) – The number of slices to create. If not provided, it will be equal to current Z dimension.
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### VSlice(name: str, operandA: Tensor, slices: int)

Slice along vertical axis into given number of pieces.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **slices** (*int*) – The number of slices to create
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### VStack(name: str, operandA: Tensor, slices: int = -1)

Stack Z dimension along vertical dimension.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **slices** (*int* *,* *optional*) – The number of slices to create. If not provided, it will be equal to current Z dimension.
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Reshape(name: str, operandA: Tensor, shape: Tuple[int, ...])

TM

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – Input operand A
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Index(name: str, operandA: Tensor, dim: int, start: int, stop: int | None = None, stride: int = 1)

TM

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – Input operand A
  * **dim** (*int*) – Dimension to slice
  * **start** (*int*) – Starting slice index (inclusive)
  * **stop** (*int*) – Stopping slice index (exclusive)
  * **stride** (*int*) – Stride amount along that dimension
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Select(name: str, operandA: Tensor, dim: int, index: int | Tuple[int, int], stride: int = 0)

TM

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – Input operand A
  * **dim** (*int*) – Dimension to slice
  * **index** (*int*) – int: Index to select from that dimension
    [start: int, length: int]: Index range to select from that dimension
  * **stride** (*int*) – Stride amount along that dimension
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Pad(name: str, operandA: Tensor, pad: Tuple[int, int, int, int] | Tuple[int, int], mode: str = 'constant', channel_last: bool = False)

TM

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – Input operand A
  * **pad** (*tuple*) – Either (padding_left, padding_right) or (padding_left, padding_right, padding_top, padding_bottom))
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Concatenate(name: str, \*operands: Tensor, axis: int)

Concatenate tensors along axis

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operands** (*Tuple* *[**Tensor* *,*  *...* *]*) – tensors to be concatenated
  * **axis** (*int*) – concatenate axis
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Activations

| [`Relu`](#pybuda.op.Relu)(name, operandA[, threshold, mode])   | ReLU                                                                             |
|----------------------------------------------------------------|----------------------------------------------------------------------------------|
| [`Gelu`](#pybuda.op.Gelu)(name, operandA[, approximate])       | GeLU                                                                             |
| [`Sigmoid`](#pybuda.op.Sigmoid)(name, operandA)                | * **param name:**<br/>  Op name, unique to the module, or leave blank to autoset |

<a id="module-3"></a>

### Relu(name: str, operandA: Tensor, threshold=0.0, mode='min')

ReLU

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Gelu(name: str, operandA: Tensor, approximate='none')

GeLU

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **approximate** (*str*) – The gelu approximation algorithm to use: ‘none’ | ‘tanh’.
    Default: ‘none’
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Sigmoid(name: str, operandA: Tensor)

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Math

| [`Exp`](#pybuda.op.Exp)(name, operandA)               | Exponent operation.                                                              |
|-------------------------------------------------------|----------------------------------------------------------------------------------|
| [`Reciprocal`](#pybuda.op.Reciprocal)(name, operandA) | Reciprocal operation.                                                            |
| [`Sqrt`](#pybuda.op.Sqrt)(name, operandA)             | Square root.                                                                     |
| [`Log`](#pybuda.op.Log)(name, operandA)               | Log operation: natural logarithm of the elements of operandA                     |
| [`Abs`](#pybuda.op.Abs)(name, operandA)               | Sigmoid                                                                          |
| [`Clip`](#pybuda.op.Clip)(name, operandA, min, max)   | Clips tensor values between min and max                                          |
| [`Max`](#pybuda.op.Max)(name, operandA, operandB)     | Elementwise max of two tensors                                                   |
| [`Argmax`](#pybuda.op.Argmax)(name, operandA[, dim])  | * **param name:**<br/>  Op name, unique to the module, or leave blank to autoset |

<a id="module-4"></a>

### Max(name: str, operandA: Tensor, operandB: Tensor | Parameter)

Elementwise max of two tensors

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **operandB** (*Tensor*) – Second operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Exp(name: str, operandA: Tensor)

Exponent operation.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Reciprocal(name: str, operandA: Tensor)

Reciprocal operation.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Sqrt(name: str, operandA: Tensor)

Square root.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Log(name: str, operandA: Tensor)

Log operation: natural logarithm of the elements of operandA
: yi = log_e(xi) for all xi in operandA tensor

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Argmax(name: str, operandA: Tensor, dim: int | None = None)

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Abs(name: str, operandA: Tensor)

Sigmoid

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Clip(name: str, operandA: Tensor, min: float, max: float)

Clips tensor values between min and max

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **min** (*float*) – Minimum value
  * **max** (*float*) – Maximum value
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Convolutions

| [`Conv2d`](#pybuda.op.Conv2d)(name, activations, weights[, bias, ...])      | Conv2d transformation on input activations, with optional bias.          |
|-----------------------------------------------------------------------------|--------------------------------------------------------------------------|
| [`Conv2dTranspose`](#pybuda.op.Conv2dTranspose)(name, activations, weights) | Conv2dTranspose transformation on input activations, with optional bias. |
| [`MaxPool2d`](#pybuda.op.MaxPool2d)(name, activations, kernel_size[, ...])  | Maxpool2d transformation on input activations                            |
| [`AvgPool2d`](#pybuda.op.AvgPool2d)(name, activations, kernel_size[, ...])  | Avgpool2d transformation on input activations                            |

<a id="module-5"></a>

### Conv2d(name: str, activations: Tensor, weights: Tensor | Parameter, bias: Tensor | Parameter | None = None, stride: int = 1, padding: int | str | List = 'same', dilation: int = 1, groups: int = 1, channel_last: bool = False)

Conv2d transformation on input activations, with optional bias.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **activations** (*Tensor*) – Input activations of shape (N, Cin, iH, iW)
  * **weights** – 

    Tensor
    : Input weights of shape (Cout, Cin / groups, kH, kW)

    [Tensor]
    : Internal Use pre-split
      Optional Input weights list of shape [(weight_grouping, Cin / groups, Cout)]
      of length: (K\*K // weight_grouping)
  * **bias** (*Tenor* *,* *optional*) – Optional bias tensor of shape (Cout)

### Conv2dTranspose(name: str, activations: Tensor, weights: Tensor | Parameter, bias: Tensor | Parameter | None = None, stride: int = 1, padding: int | str = 'same', dilation: int = 1, groups: int = 1, channel_last: bool = False)

Conv2dTranspose transformation on input activations, with optional bias.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **activations** (*Tensor*) – Input activations of shape (N, Cin, iH, iW)
  * **weights** – 

    Tensor
    : Input weights of shape (Cout, Cin / groups, kH, kW)

    [Tensor]
    : Internal Use pre-split
      Optional Input weights list of shape [(weight_grouping, Cin / groups, Cout)]
      of length: (K\*K // weight_grouping)
  * **bias** (*Tenor* *,* *optional*) – Optional bias tensor of shape (Cout)

### MaxPool2d(name: str, activations: Tensor, kernel_size: int | Tuple[int, int], stride: int = 1, padding: int | str = 'same', dilation: int = 1, ceil_mode: bool = False, return_indices: bool = False, max_pool_add_sub_surround: bool = False, max_pool_add_sub_surround_value: float = 1.0, channel_last: bool = False)

Maxpool2d transformation on input activations

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **activations** (*Tensor*) – Input activations of shape (N, Cin, iH, iW)
  * **kernel_size** – Size of pooling region

### AvgPool2d(name: str, activations: Tensor, kernel_size: int | Tuple[int, int], stride: int = 1, padding: int | str = 'same', ceil_mode: bool = False, count_include_pad: bool = True, divisor_override: float | None = None, channel_last: bool = False)

Avgpool2d transformation on input activations

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **activations** (*Tensor*) – Input activations of shape (N, Cin, iH, iW)
  * **kernel_size** – Size of pooling region

### NN

| [`Softmax`](#pybuda.op.nn.Softmax)(name, operandA, \*, dim[, stable])        | Softmax operation.   |
|------------------------------------------------------------------------------|----------------------|
| [`Layernorm`](#pybuda.op.nn.Layernorm)(name, operandA, weights, bias[, ...]) | Layer normalization. |

<a id="module-pybuda.op.nn"></a>

### Softmax(name: str, operandA: Tensor, \*, dim: int, stable: bool = True)

Softmax operation.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
  * **dim** (*int*) – – A dimension along which Softmax will be computed (so every slice along dim will sum to 1).
  * **stable** (*bool*) – Use stable softmax or not.
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

### Layernorm(name: str, operandA: Tensor, weights: Tensor | Parameter, bias: Tensor | Parameter, dim: int = -1, epsilon: float = 1e-05)

Layer normalization.

* **Parameters:**
  * **name** (*str*) – Op name, unique to the module, or leave blank to autoset
  * **operandA** (*Tensor*) – First operand
* **Returns:**
  Buda tensor
* **Return type:**
  Tensor

## Module Types

| [`Module`](#pybuda.Module)(name)                                           | Module class contains a workload that can be assigned to a single device.   |
|----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| [`PyTorchModule`](#pybuda.PyTorchModule)(name, module[, redirect_forward]) | A wrapper around a PyTorch module.                                          |
| [`TFModule`](#pybuda.TFModule)(name, module)                               | A wrapper around a TF module.                                               |
| [`OnnxModule`](#pybuda.OnnxModule)(name, module, onnx_path)                | A wrapper around a Onnx module.                                             |
| [`PyBudaModule`](#pybuda.PyBudaModule)(name)                               | A base class for all PyBuda modules.                                        |

### *class* Module(name: str)

Module class contains a workload that can be assigned to a single device. The workload can be implemented in PyTorch or in PyBuda.

#### get_device()

Returns the device that this op is placed onto.

* **Returns:**
  Device, or None if op has not been placed yet
* **Return type:**
  Optional[[Device](#pybuda.Device)]

#### get_name()

Returns the name of the module.

* **Returns:**
  Device, or None if op has not been placed yet
* **Return type:**
  Optional[[Device](#pybuda.Device)]

#### run(\*args)

Run inference on this module on a TT device. There should be no other modules manually placed on any devices.

* **Parameters:**
  **\*args** (*tensor*) – Inference inputs
* **Returns:**
  Outputs of inference
* **Return type:**
  Tuple[tensor,….]

### *class* PyTorchModule(name: str, module: Module, redirect_forward: bool = True)

A wrapper around a PyTorch module. If placed on a CPU device, PyTorchModules will be executed as is, and if placed
on a TT device, modules will be lowered to PyBuda.

#### forward(\*args, \*\*kwargs)

Run PyTorch module forward, with pre-loaded inputs in input queues

* **Parameters:**
  * **\*args** – Inputs into the module
  * **\*\*kwargs** – Keyword inputs into the moduls
* **Returns:**
  Output tensors, one for each of the module outputs
* **Return type:**
  Tuple[torch.tensor]

#### backward(\*args)

Run PyTorch module backward, with pre-loaded inputs in input queues

* **Parameters:**
  **\*args** (*List* *[**Tuple* *[**torch.tensor* *,* *torch.tensor* *]* *]*) – List of tuples of output tensors and incoming loss tensors

#### add_parameter(name: str, parameter: Parameter)

Adds a new parameter.

* **Parameters:**
  * **name** (*str*) – Parameter name
  * **parameter** (*Parameter*) – Parameter to add
  * **prepend_name** (*Bool*) – Whether to prepend module name to parameter name

#### set_parameters(\*\*kwargs)

Set parameters (weights) in this module, by name.

* **Parameters:**
  **kwargs** – Name-value pairs of parameter/weight names and tensor values

#### get_parameters()

Return the list of parameters defined in this module

* **Returns:**
  List of all parameters in this module
* **Return type:**
  List[Parameter]

### *class* TFModule(name: str, module: Model)

A wrapper around a TF module. Currently, TF modules can only run on a CPU device.

#### forward(\*args, \*\*kwargs)

Run TF module forward, converting pytorch tensors as necessary

* **Parameters:**
  * **\*args** – Inputs into the module
  * **\*\*kwargs** – Keyword inputs into the moduls
* **Returns:**
  Output tensors, one for each of the module outputs
* **Return type:**
  Tuple[tf.Tensor]

#### call(\*args, \*\*kwargs)

Run TF module forward, with pre-loaded inputs in input queues

* **Parameters:**
  * **\*args** – Inputs into the module
  * **\*\*kwargs** – Keyword inputs into the moduls
* **Returns:**
  Output tensors, one for each of the module outputs
* **Return type:**
  Tuple[tf.Tensor]

#### backward(\*args)

Run TF module backward, with pre-loaded inputs in input queues

* **Parameters:**
  **\*args** (*List* *[**Tuple* *[**tf.Tensor* *,* *tf.Tensor* *]* *]*) – List of tuples of output tensors and incoming loss tensors

### *class* OnnxModule(name: str, module: ModelProto, onnx_path: str)

A wrapper around a Onnx module.

### *class* PyBudaModule(name: str)

A base class for all PyBuda modules. User should extend this class and implement forward function with workload implementation.

#### pre_forward(\*args, \*\*kwargs)

Called before forward. Override this function to add custom logic.

#### add_parameter(name: str, parameter: Parameter, prepend_name: bool = False)

Adds a new parameter.

* **Parameters:**
  * **name** (*str*) – Parameter name
  * **parameter** (*Parameter*) – Parameter to add
  * **prepend_name** (*Bool*) – Whether to prepend module name to parameter name

#### add_constant(name: str, prepend_name: bool = False, shape: Tuple[int] | None = None)

Adds a new constant.

* **Parameters:**
  * **name** (*str*) – Constant name
  * **prepend_name** (*Bool*) – Whether to prepend module name to constant name

#### get_constant(name)

Gets a constant by name

* **Parameters:**
  **name** (*str*) – constant name
* **Returns:**
  constant in module
* **Return type:**
  pybuda.Tensor

#### set_constant(name: str, data: Tensor | Tensor | ndarray)

Set value for a module constant.

* **Parameters:**
  * **name** (*str*) – constant name
  * **data** (*SomeTensor*) – Tensor value to be set

#### get_parameter(name)

Gets a parameter by name

* **Parameters:**
  **name** (*str*) – Parameter name
* **Returns:**
  Module parameter
* **Return type:**
  Parameter

#### get_parameters(submodules: bool = True)

Return the list of parameters defined in this module and (optionally) all submodules.

* **Parameters:**
  **submodules** (*bool* *,* *optional*) – If set, parameters of submodules will be returned, as well. True by default.
* **Returns:**
  List of all parameters in this (and submodules, optionally) module
* **Return type:**
  List[Parameter]

#### set_parameter(name: str, data: Tensor | Tensor | ndarray)

Set value for a module parameter.

* **Parameters:**
  * **name** (*str*) – Parameter name
  * **data** (*SomeTensor*) – Tensor value to be set

#### load_parameter_dict(data: Dict[str, Tensor | Tensor | ndarray])

Load all parameter values specified in the dictionary.

* **Parameters:**
  **data** (*Dict* *[**str* *,* *SomeTensor* *]*) – Dictionary of name->tensor pairs to be loaded into parameters

#### insert_tapout_queue_for_op(op_name: str, output_index: int)

Insert an intermediate queue for op (used for checking/debugging)

* **Parameters:**
  * **op_name** (*str*) – Op name
  * **output_index** (*int*) – Index of the output tensor on the op you want to associate with the queue
* **Returns:**
  Unique handle for the tapout queue, used to retrieve values later
* **Return type:**
  IntQueueHandle

## Device Types

| [`Device`](#pybuda.Device)(name[, mp_context])                          | Device class represents a physical device which can be a Tenstorrent device, or a CPU.   |
|-------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| [`CPUDevice`](#pybuda.CPUDevice)(name[, optimizer_f, scheduler_f, ...]) | CPUDevice represents a CPU processor.                                                    |
| [`TTDevice`](#pybuda.TTDevice)(name, num_chips, chip_ids, arch, ...)    | TTDevice represents one or more Tenstorrent devices that will receive modules to run.    |

### *class* Device(name: str, mp_context=None)

Device class represents a physical device which can be a Tenstorrent device, or a CPU. In a typical operation,
each device spawns a process on the host CPU which is either used to run commands on the CPU (if device is
a CPU), or feeds commands to the Tenstorrent device.

Each device will allocate input queues for the first module it will execute. On a CPU, these are usually
some kind of multiprocessing queues with shared memory storage, and Tenstorrent devices have queues in
on-device memory.

One or more Modules can be placed on the device to be executed.

#### place_module(module: [Module](#pybuda.Module) | Tuple[[Module](#pybuda.Module)] | List[[Module](#pybuda.Module)])

Places a module, or list of modules, on this device for execution. Modules will be run as a sequential pipeline
on this single device.

* **Parameters:**
  **module** (*Union* *[*[*Module*](#pybuda.Module) *,* *Tuple* *[*[*Module*](#pybuda.Module) *]* *,* *List* *[*[*Module*](#pybuda.Module) *]* *]*) – A single Module or a list of Modules to be placed on the device

#### place_loss_module(module: [Module](#pybuda.Module))

Places a module used to calculate loss on this device. This must be the last device in the pipeline.

* **Parameters:**
  **module** ([*Module*](#pybuda.Module)) – A single loss module

#### remove_loss_module()

Remove module used to calculate loss from this device

#### push_to_inputs(\*tensors: Tuple[Tensor | Tensor, ...] | Dict[str, Tensor | Tensor])

Push tensor(s) to module inputs, either in order, or by keyword argumet if a dictionary is used. The data will be queued
up on the target device until it is ready to be consumed.

This call can block if there is no space on the target device’s input queues.

* **Parameters:**
  **\*tensors** (*Union* *[**torch.Tensor* *,* *Tensor* *]*) – Ordered list of inputs to be pushed into the module’s input queue. Can be pytorch or pybuda tensor.

#### push_to_target_inputs(\*tensors)

Push tensor(s) to module training target inputs, in order. The data will be queued up on the target
device until it is ready to be consumed.

This call can block if there is no space on the target device’s input queues.

* **Parameters:**
  **tensors** – Ordered list of inputs to be pushed into the module’s target input queue

#### push_to_command_queue(cmd)

Send command to the running main loop in another process

#### get_command_queue_response()

Read from command queue response. This is blocking.

* **Returns:**
  Command-specific dictionary with response data, or None in case of failures
* **Return type:**
  Optional[Dict]

#### get_next_command(command_queue: Queue)

Read next command to run, from the given command queue. Blocking.

* **Parameters:**
  **command_queue** (*queue.Queue*) – Queue of commands
* **Returns:**
  Next command from the queue, or None if shutdown_even was set
* **Return type:**
  Command

#### run_next_command(cmd: Command)

In concurrent mode, this is called in a forever loop by the process dedicated to this device.
In sequential mode, the main process will call this until there’s no more work to do.

* **Parameters:**
  **command_queue** (*queue.Queue*) – Command queue to read commands from
* **Returns:**
  True if quit command was seen
* **Return type:**
  bool

#### dc_transfer_thread(direction: str, direction_queue: Queue)

Keep transfering data in a thread. One per direction.

#### dc_transfer(direction: str)

Transfer data between devices

#### run(output_dir: str)

Main process loop in concurrent mode.

The loop receives commands through its command queue, which indicate how many epochs & iterations to
run, whether to run training or inference, and position in the pipeline.

The loop will run until shutdown command is sent in the command queue, or shutdown event is raised due
to an exception in another process

* **Parameters:**
  **output_dir** (*str*) – Output directory needed by perf trace on every process

#### compile_for(training: bool, microbatch_size: int = 0, microbatch_count: int = 1)

Save microbatch size and count

#### get_first_targets()

Return the tuple of first targets pushed to this device

#### get_first_inputs(peek=False)

Return the microbatch size, and first input in microbatch pushed into the device. If input_shapes/input_types
are provided, then those will be used to create input tensors.

This is used to compile and optimize the model for dimensions provided by the first input.

#### shutdown_device()

Check for any mp queues that are not empty, and drain them

#### cpueval_backward(bw_inputs: List[Tensor], parameters: Dict[str, Tensor])

Evaluate backward pass for verification. cpueval_forward should’ve been called first, with
save_for_backward set.

* **Parameters:**
  * **bw_inputs** (*List* *[**torch.Tensor* *]*) – BW inputs, i.e. losses for each fw output
  * **parameters** (*Dict* *[**str* *,* *torch.Tensor* *]*) – Module parameters
* **Returns:**
  * *List[Tensor]* – Gradients on ordered inputs
  * *Dict[str, Tensor]* – Gradients on parameters

#### generate(loop_count: int, write_index: int)

Run generate forward pass on each module on this device, in order

* **Parameters:**
  * **loop_count** (*int*) – Number of micro-batches to run
  * **write_index** (*int*) – Write location for past cache buffers

#### forward(loop_count: int)

Run forward pass on each module on this device, in order

* **Parameters:**
  **loop_count** (*int*) – Number of micro-batches to run

#### backward(loop_count: int, zero_grad: bool)

Run backward pass on each module on this device, in reverse order

* **Parameters:**
  * **loop_count** (*int*) – Each mini-batch is broken into micro-batches. This is necessary to fill a multi-device pipeline,
    and should be roughly 4-6x the number of devices in the pipeline for ideal performance.
  * **zero_grad** (*bool*) – Set to true to have optimizer zero out gradients before the run

### *class* CPUDevice(name: str, optimizer_f: Callable | None = None, scheduler_f: Callable | None = None, mp_context=None, retain_backward_graph=False, module: [PyTorchModule](#pybuda.PyTorchModule) | List[[PyTorchModule](#pybuda.PyTorchModule)] | None = None, input_dtypes: List[dtype] | None = None)

CPUDevice represents a CPU processor. It will spawn a process and run local operations on the assigned processor.

#### forward_pt(loop_count: int)

Run forward pass on each module on this device, in order

* **Parameters:**
  **loop_count** (*int*) – Number of micro-batches to run

#### forward_tf(loop_count: int)

Run forward pass on each module on this device, in order

* **Parameters:**
  **loop_count** (*int*) – Number of micro-batches to run

#### forward(loop_count: int)

Run forward pass on each module on this device, in order

* **Parameters:**
  **loop_count** (*int*) – Number of micro-batches to run

#### backward(loop_count: int, zero_grad: bool)

Run backward pass on each module on this device, in reverse order

* **Parameters:**
  * **loop_count** (*int*) – Each mini-batch is broken into micro-batches. This is necessary to fill a multi-device pipeline,
    and should be roughly 4-6x the number of devices in the pipeline for ideal performance.
  * **zero_grad** (*bool*) – Set to true to have optimizer zero out gradients before the run

#### generate(loop_count: int, write_index: int)

Run forward pass on each module on this device, in order

* **Parameters:**
  **loop_count** (*int*) – Number of micro-batches to run

#### compile_for_pt(inputs: Tuple[Tensor, ...], compiler_cfg: CompilerConfig, targets: List[Tensor] = [], microbatch_size: int = 0, microbatch_count: int = 1, verify_cfg: VerifyConfig | None = None)

For a CPU device, there is currently no compilation. This function propagates input shapes through the model
to return output shapes and formats.

* **Parameters:**
  * **inputs** (*Tuple* *[**Tensor* *,*  *...* *]*) – Tuple of input tensors. They must have shape and format set, but do not need to hold data unless
    auto-verification is set.
  * **compiler_cfg** (*CompilerConfig*) – Compiler configuration
  * **targets** (*List* *[**Tensor* *]* *,* *optional*) – Optional list of target tensors, if this device has a loss module
  * **microbatch_size** (*int* *,* *optional*) – The size of microbatch. Must be non-zero for training mode.
  * **microbatch_count** (*int*) – Only relevant for training and TT devices.
  * **verify_cfg** (*Optional* *[**VerifyConfig* *]*) – Optional auto-verification of compile process
* **Returns:**
  Output tensors
* **Return type:**
  Tuple[Tensor, …]

#### compile_for_tf(inputs: Tuple[Tensor, ...], compiler_cfg: CompilerConfig, targets: List[Tensor] = [], microbatch_size: int = 0, verify_cfg: VerifyConfig | None = None)

For a CPU device, there is currently no compilation. This function propagates input shapes through the model
to return output shapes and formats.

* **Parameters:**
  * **inputs** (*Tuple* *[**Tensor* *,*  *...* *]*) – Tuple of input tensors. They must have shape and format set, but do not need to hold data unless
    auto-verification is set.
  * **compiler_cfg** (*CompilerConfig*) – Compiler configuration
  * **targets** (*List* *[**Tensor* *]* *,* *optional*) – Optional list of target tensors, if this device has a loss module
  * **microbatch_size** (*int* *,* *optional*) – The size of microbatch. Must be non-zero for training mode.
  * **verify_cfg** (*Optional* *[**VerifyConfig* *]*) – Optional auto-verification of compile process
* **Returns:**
  Output tensors
* **Return type:**
  Tuple[Tensor, …]

#### compile_for(inputs: Tuple[Tensor, ...], compiler_cfg: CompilerConfig, targets: List[Tensor] = [], microbatch_size: int = 0, microbatch_count: int = 1, verify_cfg: VerifyConfig | None = None)

For a CPU device, there is currently no compilation. This function propagates input shapes through the model
to return output shapes and formats.

* **Parameters:**
  * **inputs** (*Tuple* *[**Tensor* *,*  *...* *]*) – Tuple of input tensors. They must have shape and format set, but do not need to hold data unless
    auto-verification is set.
  * **compiler_cfg** (*CompilerConfig*) – Compiler configuration
  * **targets** (*List* *[**Tensor* *]* *,* *optional*) – Optional list of target tensors, if this device has a loss module
  * **microbatch_size** (*int* *,* *optional*) – The size of microbatch. Must be non-zero for training mode.
  * **microbatch_count** (*int*) – Only relevant for training and TT devices.
  * **verify_cfg** (*Optional* *[**VerifyConfig* *]*) – Optional auto-verification of compile process
* **Returns:**
  Output tensors
* **Return type:**
  Tuple[Tensor, …]

#### cpueval_forward_pt(inputs: List[Tensor], parameters: Dict[str, Tensor], save_for_backward: bool, targets: List[Tensor] = [])

Evaluate forward pass for verification

* **Parameters:**
  * **inputs** (*List* *[**torch.Tensor* *]*) – One input into the model (for each ordered input node)
  * **parameters** (*Dict* *[**str* *,* *torch.Tensor* *]*) – Map of model parameters
  * **save_for_backward** (*bool*) – If set, input and output tensors will be saved so we can run the backward pass later.
  * **targets** (*List* *[**torch.Tensor* *]* *,* *optional*) – If we’re running training, and there’s a loss module on this device, provide target
* **Returns:**
  Forward graph output
* **Return type:**
  List[Tensor]

#### cpueval_forward_tf(inputs: List[Tensor], parameters: Dict[str, Tensor], save_for_backward: bool, targets: List[Tensor] = [])

Evaluate forward pass for verification

* **Parameters:**
  * **inputs** (*List* *[**torch.Tensor* *]*) – One input into the model (for each ordered input node)
  * **parameters** (*Dict* *[**str* *,* *torch.Tensor* *]*) – Map of model parameters
  * **save_for_backward** (*bool*) – If set, input and output tensors will be saved so we can run the backward pass later.
  * **targets** (*List* *[**torch.Tensor* *]* *,* *optional*) – If we’re running training, and there’s a loss module on this device, provide target
* **Returns:**
  Forward graph output
* **Return type:**
  List[Tensor]

#### cpueval_forward(inputs: List[Tensor], parameters: Dict[str, Tensor], save_for_backward: bool, targets: List[Tensor] = [])

Evaluate forward pass for verification

* **Parameters:**
  * **inputs** (*List* *[**torch.Tensor* *]*) – One input into the model (for each ordered input node)
  * **parameters** (*Dict* *[**str* *,* *torch.Tensor* *]*) – Map of model parameters
  * **save_for_backward** (*bool*) – If set, input and output tensors will be saved so we can run the backward pass later.
  * **targets** (*List* *[**torch.Tensor* *]* *,* *optional*) – If we’re running training, and there’s a loss module on this device, provide target
* **Returns:**
  Forward graph output
* **Return type:**
  List[Tensor]

#### cpueval_backward(bw_inputs: List[Tensor], parameters: Dict[str, Tensor])

Evaluate backward pass for verification. cpueval_forward should’ve been called first, with
save_for_backward set.

* **Parameters:**
  * **bw_inputs** (*List* *[**torch.Tensor* *]*) – BW inputs, i.e. losses for each fw output
  * **parameters** (*Dict* *[**str* *,* *torch.Tensor* *]*) – Module parameters
* **Returns:**
  * *List[Tensor]* – Gradients on ordered inputs
  * *Dict[str, Tensor]* – Gradients on parameters

#### place_module(module: [Module](#pybuda.Module) | Tuple[[Module](#pybuda.Module)] | List[[Module](#pybuda.Module)])

Places a module, or list of modules, on this device for execution. Modules will be run as a sequential pipeline
on this single device.

* **Parameters:**
  **module** (*Union* *[*[*Module*](#pybuda.Module) *,* *Tuple* *[*[*Module*](#pybuda.Module) *]* *,* *List* *[*[*Module*](#pybuda.Module) *]* *]*) – A single Module or a list of Modules to be placed on the device

#### pop_parameter_checkpoint()

Return a dictionary of current parameter values for the models on this device.

#### set_debug_gradient_trace_queue(q: Queue)

[debug feature] Provide a queue to which incoming and outgoing gradients will be stored, for debug tracing.

#### sync()

Block until queued up commands have completed and the device is idle.

### *class* TTDevice(name: str, num_chips: int | None = None, chip_ids: ~typing.List[int] | ~typing.List[~typing.Tuple[int]] | None = None, arch: ~pybuda._C.backend_api.BackendDevice | None = None, devtype: ~pybuda._C.backend_api.BackendType | None = None, device_mode: ~pybuda._C.backend_api.DeviceMode | None = None, optimizer: ~pybuda.optimizers.Optimizer | None = None, scheduler: ~pybuda.schedulers.LearningRateScheduler | None = None, fp32_fallback: ~pybuda._C.DataFormat = <DataFormat.Float16_b: 5>, mp_context=None, module: ~pybuda.module.Module | ~typing.List[~pybuda.module.Module] | None = None)

TTDevice represents one or more Tenstorrent devices that will receive modules to run.

#### get_device_config(compiler_cfg=None)

Figure out which silicon devices will be used, if in silicon mode

#### place_module(module: [Module](#pybuda.Module) | Tuple[[Module](#pybuda.Module)] | List[[Module](#pybuda.Module)])

Places a module, or list of modules, on this device for execution. Modules will be run as a sequential pipeline
on this single device.

* **Parameters:**
  **module** (*Union* *[*[*Module*](#pybuda.Module) *,* *Tuple* *[*[*Module*](#pybuda.Module) *]* *,* *List* *[*[*Module*](#pybuda.Module) *]* *]*) – A single Module or a list of Modules to be placed on the device

#### remove_modules()

Remove placed modules, and clear the device

#### set_active_subgraph(subgraph_index: int)

Set the currently active subgraph by limiting the io queues.

#### get_active_subgraph()

Gets the currently active subgraph.

#### generate_graph(\*inputs: Tensor, target_tensors: List[Tensor] = [], return_intermediate: bool = False, graph_name: str = 'default_graph', compiler_cfg: CompilerConfig | None = None, trace_only: bool = False, verify_cfg: VerifyConfig | None = None)

Generate a buda graph from the modules on the device, and return the graph and output tensors.
If input tensors have a value set, the output tensor will also have the calculated output value
set.

* **Parameters:**
  * **inputs** (*Tuple* *[**Tensor* *,*  *...* *.* *]*) – Input tensors
  * **target_tensors** (*List* *[**Tensor* *]*) – Target inputs. Optional, if trace_only is set. Otherwise, value must be provided.
  * **return_intermediate** (*bool*) – Optional. If set, a dictionary of node IDs -> tensors will be return with intermediate values, for data mismatch debug.
  * **trace_only** (*bool*) – If set, the graph is made for a quick trace only and shouldn’t have side-effects
* **Returns:**
  Buda graph, outputs, optional intermediates, original inputs, target tensor
* **Return type:**
  Graph, Tuple[Tensor, …], Dict[str, Tensor], Tuple[Tensor, …], Optional[Tensor]

#### compile_for(inputs: Tuple[Tensor, ...], compiler_cfg: CompilerConfig, targets: List[Tensor] = [], microbatch_size: int = 0, microbatch_count: int = 1, verify_cfg: VerifyConfig | None = None)

Compile modules placed on this device, with given input shapes, input formats, and microbatch size.

* **Parameters:**
  * **training** (*bool*) – Specify whether to compile for training or inference. If set to true, autograd will be executed
    before the compile.
  * **inputs** (*Tuple* *[**Tensor* *,*  *...* *]*) – Tuple of input tensors. They must have shape and format set, but do not need to hold data unless
    auto-verification is set.
  * **compiler_cfg** (*CompilerConfig*) – Compiler configuration
  * **targets** (*List* *[**Tensor* *]* *,* *optional*) – Optional list of target tensors, if this device has a loss module
  * **microbatch_size** (*int* *,* *optional*) – The size of microbatch. Must be non-zero for training mode.
  * **microbatch_count** (*int*) – Only relevant for training. This represents the number of microbatches that are pushed through
    fwd path before bwd path runs. The device will ensure that buffering is large enough to contain
    microbatch_count number of microbatch intermediate data.
  * **verify_cfg** (*Optional* *[**VerifyConfig* *]*) – Optional auto-verification of compile process
* **Returns:**
  Output tensors
* **Return type:**
  Tuple[Tensor, …]

#### forward(loop_count: int)

Run forward pass on each module on this device, in order

* **Parameters:**
  **loop_count** (*int*) – Number of micro-batches to run

#### generate(loop_count: int, write_index: int, tokens_per_iter: int, token_id: int)

Run forward pass on each module on this device, in order

* **Parameters:**
  **loop_count** (*int*) – Number of micro-batches to run

#### cpueval_forward(inputs: List[Tensor], parameters: Dict[str, Tensor], save_for_backward: bool, targets: List[Tensor] = [])

Evaluate forward pass for verification

* **Parameters:**
  * **inputs** (*List* *[**torch.Tensor* *]*) – One input into the model (for each ordered input node)
  * **parameters** (*Dict* *[**str* *,* *torch.Tensor* *]*) – Map of model parameters
  * **save_for_backward** (*bool*) – If set, input and output tensors will be saved so we can run the backward pass later.
  * **targets** (*List* *[**torch.Tensor* *]* *,* *optional*) – If we’re running training, and there’s a loss module on this device, provide target
* **Returns:**
  Forward graph output
* **Return type:**
  List[Tensor]

#### backward(loop_count: int, zero_grad: bool)

Run backward pass on each module on this device, in reverse order

* **Parameters:**
  * **loop_count** (*int*) – Each mini-batch is broken into micro-batches. This is necessary to fill a multi-device pipeline,
    and should be roughly 4-6x the number of devices in the pipeline for ideal performance.
  * **zero_grad** (*bool*) – Set to true to have optimizer zero out gradients before the run

#### get_parameter_checkpoint()

Return a dictionary of current parameter values for the models on this device

#### get_all_parameters()

Return a dictionary of current parameter values for the models on this device

#### get_parameter_gradients()

Return a dictionary of currently accumulated gradient values for the models on this device

#### get_parameters(ignore_unused_parameters: bool = True)

* **Parameters:**
  **ignore_used_parameters** (*bool*) – If true, any parameter not being recorded by the graph-trace (i.e. parameter is unused in
  graph execution) is not included in the returned list to user.

#### get_optimizer_params(is_buda: bool)

Return a dictionary of dictionaries of optimizer parameters for each model parameter.

#### get_scheduler_params(is_buda: bool)

Return a dictionary of dictionaries of optimizer parameters used by scheduler.

#### get_dram_io_queues(queue_type: str)

Returns the appropriate queue description, tile broadcast information, and original shapes, where applicable

#### shutdown_device()

Shutdown device at the end of the workload

#### sync()

Block until queued up commands have completed and the device is idle.

## Miscellaneous

| [`DataFormat`](#pybuda.DataFormat)     | Members:   |
|----------------------------------------|------------|
| [`MathFidelity`](#pybuda.MathFidelity) | Members:   |

### *class* DataFormat

Members:

Float32

Float16

Bfp8

Bfp4

Bfp2

Float16_b

Bfp8_b

Bfp4_b

Bfp2_b

Lf8

UInt16

Int8

RawUInt8

RawUInt16

RawUInt32

Int32

Invalid

#### from_json(self: str)

#### *property* name

#### to_json(self: [pybuda._C.DataFormat](#pybuda.DataFormat))

### *class* MathFidelity

Members:

LoFi

HiFi2

HiFi3

HiFi4

Invalid

#### from_json(self: str)

#### *property* name

#### to_json(self: [pybuda._C.MathFidelity](#pybuda.MathFidelity))
