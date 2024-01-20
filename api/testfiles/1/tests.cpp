#include <iostream>
#include <vector>

std::vector<int> sortArray(std::vector<int> arr);

int main() {
    // Test case 1: Empty array
    std::vector<int> arr1;
    std::vector<int> sortedArr1 = sortArray(arr1);
    std::cout << "Sorted array 1: ";
    for (int num : sortedArr1) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    // Test case 2: Array with one element
    std::vector<int> arr2 = {5};
    std::vector<int> ans2 = {5};
    std::vector<int> sortedArr2 = sortArray(arr2);
    std::cout << "Sorted array 2: ";
    for(int i=0;i<sortedArr2.size();i++){
        if(sortedArr2[i] != ans2[i]){
            std::cout << "Wrong answer" << std::endl;
            return 1;
        }
    }
    std::cout << std::endl;

    // Test case 3: Array with multiple elements
    std::vector<int> arr3 = {3, 1, 4, 2};
    std::vector<int> ans3 = {1, 2, 3, 4};
    std::vector<int> sortedArr3 = sortArray(arr3);
    std::cout << "Sorted array 3: ";
    for(int i=0;i<sortedArr3.size();i++){
        if(sortedArr3[i] != ans3[i]){
            std::cout << "Wrong answer" << std::endl;
            return 1;
        }
    }
    std::cout << std::endl;

    return 0;
}