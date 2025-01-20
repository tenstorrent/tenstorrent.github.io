// SPDX-FileCopyrightText: © 2023 Tenstorrent Inc.
//
// SPDX-License-Identifier: Apache-2.0

#include "example_multiple_return_device_operation.hpp"

namespace ttnn::operations::examples {

ExampleMultipleReturnDeviceOperation::program_factory_t ExampleMultipleReturnDeviceOperation::select_program_factory(
    const operation_attributes_t& operation_attributes, const tensor_args_t& tensor_args) {
    return SingleCore{};
}

void ExampleMultipleReturnDeviceOperation::validate_on_program_cache_miss(
    const operation_attributes_t& attributes, const tensor_args_t& tensor_args) {
    validate_on_program_cache_hit(attributes, tensor_args);
}

void ExampleMultipleReturnDeviceOperation::validate_on_program_cache_hit(
    const operation_attributes_t& attributes, const tensor_args_t& tensor_args) {
    TT_FATAL(
        attributes.return_output1 || attributes.return_output2,
        "At least one output must be returned. return_output1 = {}, return_output2 = {} ",
        attributes.return_output1,
        attributes.return_output2);
}

ExampleMultipleReturnDeviceOperation::shape_return_value_t ExampleMultipleReturnDeviceOperation::compute_output_shapes(
    const operation_attributes_t&, const tensor_args_t& tensor_args) {
    return {tensor_args.input_tensor.shape(), tensor_args.input_tensor.shape()};
}

ExampleMultipleReturnDeviceOperation::tensor_return_value_t ExampleMultipleReturnDeviceOperation::create_output_tensors(
    const operation_attributes_t& operation_attributes, const tensor_args_t& tensor_args) {
    auto [output1_shape_opt, output2_shape_opt] = compute_output_shapes(operation_attributes, tensor_args);

    auto output1_shape = output1_shape_opt.value();
    auto output2_shape = output2_shape_opt.value();

    auto return_output1 = operation_attributes.return_output1;
    auto return_output2 = operation_attributes.return_output2;

    const auto& input_tensor = tensor_args.input_tensor;
    auto output1 =
        create_device_tensor(output1_shape, input_tensor.dtype(), input_tensor.layout(), input_tensor.device());

    auto output2 =
        create_device_tensor(output2_shape, input_tensor.dtype(), input_tensor.layout(), input_tensor.device());

    std::vector<std::optional<Tensor>> ret(2);

    if (return_output1) {
        ret[0] = output1;
    }
    if (return_output2) {
        ret[1] = output2;
    }

    return ret;
}

std::tuple<
    ExampleMultipleReturnDeviceOperation::operation_attributes_t,
    ExampleMultipleReturnDeviceOperation::tensor_args_t>
ExampleMultipleReturnDeviceOperation::invoke(const Tensor& input_tensor, bool return_output1, bool return_output2) {
    return {operation_attributes_t{true, 42, return_output1, return_output2}, tensor_args_t{input_tensor}};
}

}  // namespace ttnn::operations::examples
