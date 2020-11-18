# 常见算法题

## 给定一个大小为 *n* 的数组，找到其中的多数元素。多数元素是指在数组中出现次数**大于** `⌊ n/2 ⌋` 的元素。

```
class Solution {
    public int singleNumber(int[] nums) {
        for (int i =0; i<nums.length; i++) {
            nums[0] ^= nums[i];
        }
        return nums[0];
    }
}
```

## 给你一个长度为 n 的数组，其中只有一个数字出现了大于等于 n/2 次，问如何使用优秀的时空复杂度快速找到这个数字。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。
**示例 1:**

输入: [3,2,3]
输出: 3
**示例 2:**

输入: [2,2,1,1,1,2,2]
输出: 2

- 解法一

因为超过半数，所以排序后多数元素一定位于中间位置。

```java
class Solution {
    public int majorityElement(int[] nums) {
        Arrays.sort(nums);
        return nums[nums.length / 2];
    }
}
```

- 解法二

使用HashMap存储，key为nums中的值，value为出现的次数

```java
class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer,Integer> map = new HashMap<>();
        Map.Entry<Integer, Integer> majorityEntry = null;
        for (int num : nums) {
            if (!map.containsKey(num)) map.put(num, 1);
            else map.put(num, map.get(num) + 1);
        }
        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
            if (majorityEntry == null || entry.getValue() > majorityEntry.getValue())
                majorityEntry = entry;
        }
        return majorityEntry.getKey();
    }
}
```

- 解法三

  分治